import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatMessageDto } from "./dto/chat-message.dto";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("message")
  async sendMessage(@Body() body: ChatMessageDto) {
    if (!body.message?.trim()) {
      throw new BadRequestException("El mensaje es requerido");
    }
    return this.chatService.sendMessage(body.message, body.history);
  }
}
