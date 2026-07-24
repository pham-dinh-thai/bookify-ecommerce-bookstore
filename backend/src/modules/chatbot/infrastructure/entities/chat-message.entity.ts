import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { MessageRole } from '../../domain/chat-aggregate/enums/message-role.enum';
import { ChatSessionTypeOrm } from './chat-sessions.entity';

@Entity('chat_messages')
export class ChatMessageTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid' })
  sessionId!: string;

  @Column({ type: 'enum', enum: MessageRole })
  role!: MessageRole;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'json', nullable: true })
  metadata!: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => ChatSessionTypeOrm, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sessionId' })
  session!: ChatSessionTypeOrm;
}
