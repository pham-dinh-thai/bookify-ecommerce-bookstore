import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KnowledgeSourceType } from '../../domain/knowledge-source/enums/knowledge-source-type.enum';
import { KnowledgeChunkTypeOrm } from './knowledge-chunk.entity';

@Entity('chatbot_knowledge_sources')
export class KnowledgeSourceTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'enum', enum: KnowledgeSourceType })
  sourceType!: KnowledgeSourceType;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'varchar', length: 10, default: 'vi' })
  language!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => KnowledgeChunkTypeOrm, (chunk) => chunk.source, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  chunks!: KnowledgeChunkTypeOrm[];
}
