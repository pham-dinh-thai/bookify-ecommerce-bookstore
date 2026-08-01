import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatMessageTypeOrm } from './chat-message.entity';

@Entity('chat_sessions')
export class ChatSessionTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => ChatMessageTypeOrm, (message) => message.session)
  messages!: ChatMessageTypeOrm[];
}
