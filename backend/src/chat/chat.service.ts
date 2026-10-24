import { Injectable, Logger } from "@nestjs/common";
import { GoogleGenAI } from "@google/genai";
import {
  BASE_KNOWLEDGE,
  buildFullPrompt,
  hydratePlaceholders,
} from "./knowledge-base";
import { AdminDbService } from "../admin/admin-db.service";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private ai: GoogleGenAI | null = null;

  constructor(private readonly adminDb: AdminDbService) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.logger.warn("GEMINI_API_KEY not set — chat will fail");
    } else {
      this.ai = new GoogleGenAI({ apiKey });
      this.logger.log("Gemini ChatService initialized with dynamic SQLite RAG");
    }
  }

  /**
   * Cadena de modelos en orden de preferencia, leída en vivo desde ai_config en SQLite.
   */
  private getModelChain(): string[] {
    const aiConfig = this.adminDb.getAiConfig();
    const primary =
      aiConfig.primaryModel ||
      process.env.GEMINI_MODEL ||
      "gemini-2.5-flash-lite";
    const fallbacks = (
      aiConfig.fallbackModels ||
      process.env.GEMINI_MODEL_FALLBACK ||
      "gemini-3.1-flash-lite,gemini-3.5-flash-lite,gemini-2.5-flash"
    )
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    return [...new Set([primary, ...fallbacks])];
  }

  private getSystemInstruction(): { instruction: string; temperature: number } {
    const aiConfig = this.adminDb.getAiConfig();
    const settingsMap = this.adminDb.getSettingsMap();
    const memories = this.adminDb.getMemories();
    const baseMem = memories.find((m) => m.slug === "base");
    const baseContent = hydratePlaceholders(
      baseMem ? baseMem.content : BASE_KNOWLEDGE,
      settingsMap,
    );

    return {
      instruction: `Sos ${aiConfig.displayName}, el asistente conversacional oficial de Pidgeon Solutions (Brian Benegas, Thomas Pineda y Gastón Alejandro).
Respondés de forma concisa, bien estructurada con viñetas cuando listas planes o servicios, sin usar encabezados (#), en español argentino (voseo: podés, tenés, escribinos) cuando te hablan en español o en inglés cuando te hablan en inglés.

${baseContent}`,
      temperature: aiConfig.temperature ?? 0.35,
    };
  }

  private isOutOfQuota(error: any): boolean {
    const msg = String(error?.message ?? "").toLowerCase();
    return (
      msg.includes("429") ||
      msg.includes("quota") ||
      msg.includes("resource_exhausted")
    );
  }

  private isOverloaded(error: any): boolean {
    const msg = String(error?.message ?? "").toLowerCase();
    return (
      msg.includes("503") ||
      msg.includes("overloaded") ||
      msg.includes("high demand") ||
      msg.includes("unavailable")
    );
  }

  private buildHistory(
    history?: { role: "user" | "assistant"; content: string }[],
  ) {
    const normalized: { role: "user" | "model"; parts: { text: string }[] }[] =
      [];

    for (const msg of history || []) {
      const text = msg?.content?.trim();
      if (!text) continue;

      const role: "user" | "model" =
        msg.role === "assistant" ? "model" : "user";

      if (normalized.length === 0 && role === "model") {
        continue;
      }

      const prev = normalized[normalized.length - 1];
      if (prev && prev.role === role) {
        prev.parts[0].text += `\n${text}`;
      } else {
        normalized.push({ role, parts: [{ text }] });
      }
    }

    if (
      normalized.length > 0 &&
      normalized[normalized.length - 1].role === "user"
    ) {
      normalized.pop();
    }

    return normalized;
  }

  async sendMessage(
    message: string,
    history?: { role: "user" | "assistant"; content: string }[],
    locale?: string,
    clientIp?: string,
  ): Promise<{ reply: string }> {
    const normLocale = (locale || "ES").toUpperCase() === "EN" ? "EN" : "ES";

    // 1. Verificar Shadowban por IP (no gasta cuota de Gemini)
    const shadow = this.adminDb.getShadowbanForIp(clientIp);
    if (shadow) {
      this.logger.warn(`Shadowbanned IP ${clientIp} intercepted in sendMessage`);
      return {
        reply: normLocale === "EN" ? shadow.fakeReplyEn : shadow.fakeReplyEs,
      };
    }

    if (!this.ai) {
      return {
        reply:
          "El servicio de chat no está disponible en este momento. Escribinos por WhatsApp al +54 11 3155-6315.",
      };
    }

    const chatHistory = this.buildHistory(history);
    const memories = this.adminDb.getMemories();
    const settingsMap = this.adminDb.getSettingsMap();
    const aiConfig = this.adminDb.getAiConfig();

    const { fullPrompt, matchedSlugs } = buildFullPrompt(message, locale, {
      memories,
      settingsMap,
      aiConfig,
    });
    const { instruction, temperature } = this.getSystemInstruction();

    this.logger.debug(
      `RAG [${normLocale}] "${message.slice(0, 50)}" -> [${matchedSlugs.join(", ")}]`,
    );

    const chain = this.getModelChain();
    let lastError: any;

    for (const modelName of chain) {
      const attempts = this.isOutOfQuota(lastError) ? 1 : 2;
      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          const chat = this.ai.chats.create({
            model: modelName,
            history: chatHistory,
            config: {
              systemInstruction: instruction,
              temperature,
            },
          });

          const response = await chat.sendMessage({ message: fullPrompt });
          const reply =
            response.text?.trim() ||
            "No pude generar una respuesta en este momento. Intentá de nuevo.";
          return { reply };
        } catch (error: any) {
          lastError = error;
          if (this.isOutOfQuota(error)) {
            this.logger.warn(`Quota reached on "${modelName}", trying next model.`);
            break;
          }
          if (!this.isOverloaded(error) || attempt === attempts) {
            this.logger.warn(
              `Model "${modelName}" failed: ${error?.message || error}`,
            );
            break;
          }
          await new Promise((r) => setTimeout(r, 700 * attempt));
        }
      }
    }

    this.logger.error(
      `All models failed in sendMessage: ${lastError?.message || lastError}`,
    );
    return {
      reply: `Nuestro asistente está con alta demanda en este momento. Podés escribirnos directo por WhatsApp al ${settingsMap.whatsapp_number || "+54 11 3155-6315"}.`,
    };
  }

  async *sendMessageStream(
    message: string,
    history?: { role: "user" | "assistant"; content: string }[],
    locale?: string,
    clientIp?: string,
  ): AsyncGenerator<string> {
    const normLocale = (locale || "ES").toUpperCase() === "EN" ? "EN" : "ES";

    // 1. Verificar Shadowban por IP: simula streaming por chunks sin invocar a Gemini
    const shadow = this.adminDb.getShadowbanForIp(clientIp);
    if (shadow) {
      this.logger.warn(
        `Shadowbanned IP ${clientIp} intercepted in sendMessageStream`,
      );
      const decoy =
        normLocale === "EN" ? shadow.fakeReplyEn : shadow.fakeReplyEs;
      const words = decoy.split(" ");
      for (let i = 0; i < words.length; i++) {
        yield (i === 0 ? "" : " ") + words[i];
        await new Promise((r) => setTimeout(r, 35));
      }
      return;
    }

    if (!this.ai) {
      yield "El servicio de chat no está disponible en este momento. Escribinos por WhatsApp al +54 11 3155-6315.";
      return;
    }

    const chatHistory = this.buildHistory(history);
    const memories = this.adminDb.getMemories();
    const settingsMap = this.adminDb.getSettingsMap();
    const aiConfig = this.adminDb.getAiConfig();

    const { fullPrompt, matchedSlugs } = buildFullPrompt(message, locale, {
      memories,
      settingsMap,
      aiConfig,
    });
    const { instruction, temperature } = this.getSystemInstruction();

    this.logger.debug(
      `RAG Stream [${normLocale}] "${message.slice(0, 50)}" -> [${matchedSlugs.join(", ")}]`,
    );

    const chain = this.getModelChain();
    let lastError: any;

    for (const modelName of chain) {
      const attempts = this.isOutOfQuota(lastError) ? 1 : 2;
      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          const chat = this.ai.chats.create({
            model: modelName,
            history: chatHistory,
            config: {
              systemInstruction: instruction,
              temperature,
            },
          });

          const stream = await chat.sendMessageStream({ message: fullPrompt });

          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) {
              yield text;
            }
          }
          return;
        } catch (error: any) {
          lastError = error;
          if (this.isOutOfQuota(error)) {
            this.logger.warn(
              `Quota reached on "${modelName}", switching to next fallback model.`,
            );
            break;
          }
          if (!this.isOverloaded(error) || attempt === attempts) {
            this.logger.warn(
              `Stream failed on "${modelName}": ${error?.message || error}`,
            );
            break;
          }
          await new Promise((r) => setTimeout(r, 700 * attempt));
        }
      }
    }

    this.logger.error(
      `All models failed in sendMessageStream: ${lastError?.message || lastError}`,
    );
    yield `Nuestro asistente está con alta demanda en este momento. Podés escribirnos directo por WhatsApp al ${settingsMap.whatsapp_number || "+54 11 3155-6315"}.`;
  }
}
