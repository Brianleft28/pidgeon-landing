import { Injectable, Logger } from "@nestjs/common";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are the AI assistant for Pidgeon Solutions, a software & AI studio founded by Brian Benegas and his partners (Gastón Alejandro).

Your role: Help potential and existing clients with questions about our services, AI chatbots, pricing plans, and technical capabilities.

Company info:
- Pidgeon Solutions specializes in AI Chatbots & Conversational Agents, GovTech, enterprise web apps, and workflow automation.
- Team: Brian Benegas (Tech Lead & Infrastructure), Gastón Alejandro (Operations & Strategy).
- Core stack: Svelte 5, NestJS, TypeScript, Docker, Google Gemini AI, Model Context Protocol (MCP).

Featured Service — AI Chatbots & Conversational Agents:
1. 24/7 WhatsApp & Web Customer Care: Instant answers on catalog, pricing, stock, and FAQs while the client sleeps.
2. Lead Qualification & CRM Sync: Interviews prospects, scores intent/budget, and pushes qualified leads straight into the CRM.
3. Automated Appointment & Booking Bots: Checks real-time calendar availability, books slots, and sends WhatsApp reminders.
4. GovTech Citizen Desk (MCP): Connects to municipal/internal databases in real time so citizens can check file status, requirements, and procedures 24/7.

Plans (reference pricing; contracting is coordinated directly with our team via Contact form or WhatsApp, no online checkout on the site):
1. Entrepreneur (US$100/mo or US$1,000/yr) — One-page website, contact form, free domain (1yr), basic hosting.
2. Small Business (US$250/mo or US$2,500/yr) — Multi-page site, catalog/e-commerce (up to 50 products), blog, Google Maps, basic SEO.
3. Custom System / AI & Enterprise (US$1,000+) — Custom AI chatbots, CRM/ERP, unlimited users, API/MCP integrations, advanced automation, priority support.

Launch offer: 30% OFF on the first website.

Three technology pillars:
- LLM (Intelligence): AI that understands natural language and makes decisions.
- MCP (Context): Connects AI securely to real business data, calendars, and CRMs in real time.
- Automation (Execution): Executes tasks like scheduling appointments, sending invoices, updating CRMs, and alerting teams.

Rules:
- Respond in the same language the user writes in (Spanish or English).
- Be professional, friendly, direct, and concise (limit responses to 4-6 sentences).
- Do not invent prices or features that don't exist.
- For custom chatbots or complex technical questions, invite the user to leave a message in the Contact modal or reach out via WhatsApp.
- WhatsApp contact: +54 11 3155-6315
- Email contact: soporte@pidgeonsolution.com
`;

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
   * Si el modelo principal devuelve 429 (cuota agotada) o falla, salta al siguiente.
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

  private buildHistory(history?: { role: "user" | "assistant"; content: string }[]) {
    return (history || []).map((msg) => ({
      role: (msg.role === "assistant" ? "model" : "user") as "user" | "model",
      parts: [{ text: msg.content }],
    }));
  }

  async sendMessage(
    message: string,
    history?: { role: "user" | "assistant"; content: string }[],
  ): Promise<{ reply: string }> {
    if (!this.ai) {
      return {
        reply:
          "El servicio de chat no está disponible en este momento. Escribinos por WhatsApp al +54 11 3155-6315.",
      };
    }

    const chatHistory = this.buildHistory(history);
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
              systemInstruction: SYSTEM_PROMPT,
            },
          });

          const response = await chat.sendMessage({ message });
          const reply =
            response.text ||
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
  ): AsyncGenerator<string> {
    if (!this.ai) {
      yield "El servicio de chat no está disponible en este momento. Escribinos por WhatsApp al +54 11 3155-6315.";
      return;
    }

    const chatHistory = this.buildHistory(history);
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
              systemInstruction: SYSTEM_PROMPT,
            },
          });

          const stream = await chat.sendMessageStream({ message });

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
