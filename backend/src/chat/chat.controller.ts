import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  Res,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChatService } from "./chat.service";
import { ChatPersistenceService } from "./chat-persistence.service";
import { ChatMessageDto } from "./dto/chat-message.dto";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import type { Response, Request } from "express";

@Controller("chat")
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatPersistenceService: ChatPersistenceService,
  ) {}

  // --- Anonymous endpoints (unchanged) ---

  @Post("message")
  async sendMessage(@Body() body: ChatMessageDto) {
    if (!body.message?.trim()) {
      throw new BadRequestException("El mensaje es requerido");
    }
    return this.chatService.sendMessage(body.message, body.history);
  }

  @Post("message/stream")
  streamMessage(@Body() body: ChatMessageDto, @Res() res: Response) {
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

  // --- Authenticated conversation endpoints ---

  @UseGuards(AuthGuard("jwt"))
  @Post("conversations")
  async createConversation(
    @Req() req: Request,
    @Body() body: CreateConversationDto,
  ) {
    const user = req.user as any;
    return this.chatPersistenceService.createConversation(
      user.userId,
      body.title,
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("conversations")
  async getConversations(@Req() req: Request) {
    const user = req.user as any;
    return this.chatPersistenceService.getUserConversations(user.userId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("conversations/:id")
  async getConversation(@Req() req: Request, @Param("id") id: string) {
    const user = req.user as any;
    const conv = await this.chatPersistenceService.getConversation(
      id,
      user.userId,
    );
    if (!conv) throw new BadRequestException("Conversation not found");
    return conv;
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("conversations/:id/message/stream")
  async streamConversationMessage(
    @Req() req: Request,
    @Param("id") conversationId: string,
    @Body() body: ChatMessageDto,
    @Res() res: Response,
  ) {
    if (!body.message?.trim()) {
      throw new BadRequestException("El mensaje es requerido");
    }

    const user = req.user as any;

    const conv = await this.chatPersistenceService.getConversation(
      conversationId,
      user.userId,
    );
    if (!conv) throw new BadRequestException("Conversation not found");

    // Save user message
    await this.chatPersistenceService.addMessage(
      conversationId,
      "user",
      body.message,
    );

    // Auto-title on first user message
    const userMsgCount = (conv.messages || []).filter(
      (m) => m.role === "user",
    ).length;
    if (userMsgCount === 0) {
      await this.chatPersistenceService.autoTitle(conversationId, body.message);
    }

    // Stream response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const history = (conv.messages || []).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const stream = this.chatService.sendMessageStream(body.message, history);

    let fullResponse = "";
    try {
      for await (const chunk of stream) {
        fullResponse += chunk;
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      }
      // Save assistant response
      await this.chatPersistenceService.addMessage(
        conversationId,
        "assistant",
        fullResponse,
      );
      res.write("data: [DONE]\n\n");
    } catch (err) {
      res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
    } finally {
      res.end();
    }
  }
}
