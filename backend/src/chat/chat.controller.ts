import {
  Controller,
  Post,
  Body,
  Res,
  BadRequestException,
  UseGuards,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ThrottlerGuard, Throttle } from "@nestjs/throttler";
import type { Response } from "express";

interface ChatRequestBody {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
  locale?: string;
}

@UseGuards(ThrottlerGuard)
@Throttle({ chat: { limit: 20, ttl: 3600000 } })
@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("message")
  async sendMessage(@Body() body: ChatRequestBody) {
    if (!body.message?.trim()) {
      throw new BadRequestException("El mensaje es requerido");
    }
    return this.chatService.sendMessage(body.message, body.history, body.locale);
  }

  @Post("message/stream")
  streamMessage(@Body() body: ChatRequestBody, @Res() res: Response) {
    if (!body.message?.trim()) {
      throw new BadRequestException("El mensaje es requerido");
    }

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const stream = this.chatService.sendMessageStream(
      body.message,
      body.history,
      body.locale,
    );

    (async () => {
      try {
        for await (const chunk of stream) {
          res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        }
        res.write("data: [DONE]\n\n");
      } catch (err) {
        res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
      } finally {
        res.end();
      }
    })();
  }
}
