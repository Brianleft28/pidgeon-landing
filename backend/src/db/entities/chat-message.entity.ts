import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ChatConversation } from "./chat-conversation.entity";

@Entity("chat_messages")
export class ChatMessage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 36 })
  conversationId: string;

  @ManyToOne(() => ChatConversation, (conv) => conv.messages, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "conversationId" })
  conversation: ChatConversation;

  @Column({ type: "enum", enum: ["user", "assistant"] })
  role: "user" | "assistant";

  @Column({ type: "text" })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
