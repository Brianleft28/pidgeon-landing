import { Injectable, Logger } from "@nestjs/common";
import { GoogleGenAI } from "@google/genai";
import { BASE_KNOWLEDGE, buildFullPrompt } from "./knowledge-base";

const SYSTEM_INSTRUCTION = `Sos el asistente conversacional de Pidgeon Solutions (Brian Benegas, Thomas Pineda y Gastón Alejandro).
Respondés de forma concisa, bien estructurada con viñetas cuando listas planes o servicios, sin usar encabezados (#), en español argentino (voseo: podés, tenés, escribinos) cuando te hablan en español o en inglés cuando te hablan en inglés.

${BASE_KNOWLEDGE}`;

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.logger.warn("GEMINI_API_KEY not set — chat will fail");
    } else {
      this.ai = new GoogleGenAI({ apiKey });
      this.logger.log(
        `Gemini ChatService initialized (models: ${this.getModelChain().join(" -> ")})`,
      );
    }
  }

  /**
   * Cadena de modelos en orden de preferencia (igual que en brianleft-portfolio).
   */
  private getModelChain(): string[] {
    const primary = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
    const fallbacks = (
      process.env.GEMINI_MODEL_FALLBACK ||
      "gemini-3.1-flash-lite,gemini-3.5-flash-lite,gemini-2.5-flash"
    )
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    return [...new Set([primary, ...fallbacks])];
  }

  private isOutOfQuota(error: any): boolean {
    const msg = String(error?.message ?? "").toLowerCase();
    return msg.includes("429") || msg.includes("quota") || msg.includes("resource_exhausted");
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

  /**
   * Normaliza el historial para que siempre empiece con 'user' y alterne roles ('user' <-> 'model'),
   * evitando errores o respuestas degradadas en Gemini cuando hay saludos iniciales en localStorage.
   */
  private buildHistory(history?: { role: "user" | "assistant"; content: string }[]) {
    const normalized: { role: "user" | "model"; parts: { text: string }[] }[] = [];

    for (const msg of history || []) {
      const text = msg?.content?.trim();
      if (!text) continue;

      const role: "user" | "model" = msg.role === "assistant" ? "model" : "user";

      // Gemini requiere que el historial comience con un turno de 'user'
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

    // El último turno del history previo a sendMessage debe ser 'model'
    if (normalized.length > 0 && normalized[normalized.length - 1].role === "user") {
      normalized.pop();
    }

    return normalized;
  }

  async sendMessage(
    message: string,
    history?: { role: "user" | "assistant"; content: string }[],
    locale?: string,
  ): Promise<{ reply: string }> {
    if (!this.ai) {
      return {
        reply:
          "El servicio de chat no está disponible en este momento. Escribinos por WhatsApp al +54 11 3155-6315.",
      };
    }

    const chatHistory = this.buildHistory(history);
    const { fullPrompt, matchedSlugs } = buildFullPrompt(message, locale);
    this.logger.debug(
      `RAG [${locale || "ES"}] "${message.slice(0, 50)}" -> [${matchedSlugs.join(", ")}]`,
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
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.35,
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
            this.logger.warn(`Model "${modelName}" failed: ${error?.message || error}`);
            break;
          }
          await new Promise((r) => setTimeout(r, 700 * attempt));
        }
      }
    }

    this.logger.error(`All models failed in sendMessage: ${lastError?.message || lastError}`);
    return {
      reply:
        "Nuestro asistente está con alta demanda en este momento. Podés escribirnos directo por WhatsApp al +54 11 3155-6315.",
    };
  }

  async *sendMessageStream(
    message: string,
    history?: { role: "user" | "assistant"; content: string }[],
    locale?: string,
  ): AsyncGenerator<string> {
    if (!this.ai) {
      yield "El servicio de chat no está disponible en este momento. Escribinos por WhatsApp al +54 11 3155-6315.";
      return;
    }

    const chatHistory = this.buildHistory(history);
    const { fullPrompt, matchedSlugs } = buildFullPrompt(message, locale);
    this.logger.debug(
      `RAG Stream [${locale || "ES"}] "${message.slice(0, 50)}" -> [${matchedSlugs.join(", ")}]`,
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
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.35,
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
            this.logger.warn(`Quota reached on "${modelName}", switching to next fallback model.`);
            break;
          }
          if (!this.isOverloaded(error) || attempt === attempts) {
            this.logger.warn(`Stream failed on "${modelName}": ${error?.message || error}`);
            break;
          }
          await new Promise((r) => setTimeout(r, 700 * attempt));
        }
      }
    }

    this.logger.error(`All models failed in sendMessageStream: ${lastError?.message || lastError}`);
    yield "Nuestro asistente está con alta demanda en este momento. Podés escribirnos directo por WhatsApp al +54 11 3155-6315.";
  }
}
