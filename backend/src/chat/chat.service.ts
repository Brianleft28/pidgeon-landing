import { Injectable, Logger } from "@nestjs/common";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are the AI assistant for Pidgeon Solutions, a  software studio.

Your role: Help potential and existing clients with questions about services, pricing, and technical capabilities.

Company info:
- Pidgeon Solutions specializes in GovTech, enterprise apps, and AI-powered automation. 

- Team: Brian Benegas (Tech Lead), Thomas Pineda (Creative Director), Gastón Alejandro (Operations & Strategy).
- Technologies: NestJS, Svelte 5, TypeScript, MySQL, Docker, Google Gemini AI, MCP.

Plans:
1. Entrepreneur (US$100/mo) — One-page website, contact form, free domain (1yr), basic hosting.
2. Small Business (US$250/mo) — Multi-page site, e-commerce (50 products), blog, Google Maps, basic SEO.
3. Custom System (US$1,000+) — Custom CRM/ERP, unlimited users, API integrations, advanced automation, priority support.

Launch offer: 30% OFF on the first website.

Three technology pillars:
- LLM (Intelligence): AI that understands language and makes decisions.
- MCP (Context): Connects AI to real business data in real-time.
- Automation (Execution): Executes tasks like sending invoices, updating CRM, alerting teams.
- CRM (Customer Success): Manages client relationships, tracks interactions, and provides insights.
- Helpdesk (Support): Provides customer support, ticketing, and issue resolution.
- Analytics (Insights): Analyzes data to provide actionable insights for business growth.

Rules:
- Respond in the same language the user writes in (Spanish or English).
- Be professional, friendly, and concise.
- Limit responses to 5-6 sentences. For complex topics, suggest a call.
- Do not invent prices or features that don't exist.
- For complex technical questions, suggest scheduling a call.
- If asked about competitors, stay neutral and focus on Pidgeon's strengths.
- WhatsApp contact: +54 11 3155-6315
- Email contact: soporte@pidgeonsolution.com

Pidgeon Solutions is committed to helping businesses succeed with technology. Always aim to provide value and build trust with users.


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
    }
  }

  async sendMessage(
    message: string,
    history?: { role: "user" | "assistant"; content: string }[],
  ): Promise<{ reply: string }> {
    if (!this.ai) {
      return {
        reply:
          "Chat service is not configured. Please contact us via WhatsApp.",
      };
    }

    const chatHistory = (history || []).map((msg) => ({
      role: (msg.role === "assistant" ? "model" : "user") as "user" | "model",
      parts: [{ text: msg.content }],
    }));

    const chat = this.ai.chats.create({
      model: "gemini-2.5-flash",
      history: chatHistory,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    const result = await chat.sendMessage({ message });
    const reply = result.text ?? "Sorry, I could not generate a response.";

    return { reply };
  }

  async *sendMessageStream(
    message: string,
    history?: { role: "user" | "assistant"; content: string }[],
  ): AsyncGenerator<string> {
    if (!this.ai) {
      yield "Chat service is not configured. Please contact us via WhatsApp.";
      return;
    }

    const chatHistory = (history || []).map((msg) => ({
      role: (msg.role === "assistant" ? "model" : "user") as "user" | "model",
      parts: [{ text: msg.content }],
    }));

    const chat = this.ai.chats.create({
      model: "gemini-2.5-flash",
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
  }
}
