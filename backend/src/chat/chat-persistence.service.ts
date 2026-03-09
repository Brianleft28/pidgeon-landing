import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatConversation } from "../db/entities/chat-conversation.entity";
import { ChatMessage } from "../db/entities/chat-message.entity";

@Injectable()
export class ChatPersistenceService {
  constructor(
    @InjectRepository(ChatConversation)
    private convRepo: Repository<ChatConversation>,
    @InjectRepository(ChatMessage)
    private msgRepo: Repository<ChatMessage>,
  ) {}

  async createConversation(
    userId: string,
    title?: string,
  ): Promise<ChatConversation> {
    const conv = this.convRepo.create({ userId, title: title || null });
    return this.convRepo.save(conv);
  }

  async getUserConversations(userId: string): Promise<ChatConversation[]> {
    return this.convRepo.find({
      where: { userId },
      order: { updatedAt: "DESC" },
      take: 50,
    });
  }

  async getConversation(
    conversationId: string,
    userId: string,
  ): Promise<ChatConversation | null> {
    return this.convRepo.findOne({
      where: { id: conversationId, userId },
      relations: ["messages"],
    });
  }

  async addMessage(
    conversationId: string,
    role: "user" | "assistant",
    content: string,
  ): Promise<ChatMessage> {
    const msg = this.msgRepo.create({ conversationId, role, content });
    await this.convRepo.update(conversationId, { updatedAt: new Date() });
    return this.msgRepo.save(msg);
  }

  async autoTitle(
    conversationId: string,
    firstUserMessage: string,
  ): Promise<void> {
    const title =
      firstUserMessage.slice(0, 80) +
      (firstUserMessage.length > 80 ? "..." : "");
    await this.convRepo.update(conversationId, { title });
  }
}
