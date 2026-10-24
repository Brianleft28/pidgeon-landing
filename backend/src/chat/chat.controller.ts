import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  BadRequestException,
  UseGuards,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ThrottlerGuard, Throttle } from "@nestjs/throttler";
import type { Request, Response } from "express";

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

  private extractClientIp(req: Request): string {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.trim()) {
      return forwarded.split(",")[0].trim();
    }
    return req.ip || "127.0.0.1";
  }

  @Post("message")
  async sendMessage(@Body() body: ChatRequestBody, @Req() req: Request) {
    if (!body.message?.trim()) {
      throw new BadRequestException("El mensaje es requerido");
    }
    const clientIp = this.extractClientIp(req);
    return this.chatService.sendMessage(
      body.message,
      body.history,
      body.locale,
      clientIp,
    );
  }

  @Post("message/stream")
  streamMessage(
    @Body() body: ChatRequestBody,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!body.message?.trim()) {
      throw new BadRequestException("El mensaje es requerido");
    }

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const clientIp = this.extractClientIp(req);
    const stream = this.chatService.sendMessageStream(
      body.message,
      body.history,
      body.locale,
      clientIp,
    );

    (async () => {
      try {
        for await (const chunk of stream) {
          res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        }
        res.write("data: [DONE]\n\n");
      } catch {
        res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
      } finally {
        res.end();
      }
    })();
  }
}
