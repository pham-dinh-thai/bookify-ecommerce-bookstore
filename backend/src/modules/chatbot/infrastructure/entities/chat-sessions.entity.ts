import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserTypeOrm } from '../../../user-management/infrastructure/entities/user.entity';
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

  @ManyToOne(() => UserTypeOrm)
  @JoinColumn({ name: 'userId' })
  user!: UserTypeOrm;

  @OneToMany(() => ChatMessageTypeOrm, (message) => message.session)
  messages!: ChatMessageTypeOrm[];
}
