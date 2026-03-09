import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { ChatPersistenceService } from "./chat-persistence.service";
import { ChatConversation } from "../db/entities/chat-conversation.entity";
import { ChatMessage } from "../db/entities/chat-message.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatConversation, ChatMessage]),
    PassportModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatPersistenceService],
})
export class ChatModule {}
