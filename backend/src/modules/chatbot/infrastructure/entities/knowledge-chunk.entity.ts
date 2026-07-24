import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { KnowledgeSourceTypeOrm } from './knowledge-source.entity';

@Entity('chatbot_knowledge_chunks')
export class KnowledgeChunkTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid' })
  sourceId!: string;

  @Column({ type: 'int' })
  chunkIndex!: number;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'int' })
  tokenCount!: number;

  @Column({ type: 'json' })
  embedding!: number[];

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => KnowledgeSourceTypeOrm, (source) => source.chunks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sourceId' })
  source!: KnowledgeSourceTypeOrm;
}
