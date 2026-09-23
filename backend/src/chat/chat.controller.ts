import {
  Controller,
  Post,
  Body,
  Res,
  BadRequestException,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import type { Response } from "express";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("message")
  async sendMessage(
    @Body() body: { message: string; history?: { role: "user" | "assistant"; content: string }[] }
  ) {
    if (!body.message?.trim()) {
      throw new BadRequestException("El mensaje es requerido");
    }
    return this.chatService.sendMessage(body.message, body.history);
  }

  @Post("message/stream")
  streamMessage(
    @Body() body: { message: string; history?: { role: "user" | "assistant"; content: string }[] },
    @Res() res: Response
  ) {
    if (!body.message?.trim()) {
      throw new BadRequestException("El mensaje es requerido");
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const stream = this.chatService.sendMessageStream(
      body.message,
      body.history,
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
