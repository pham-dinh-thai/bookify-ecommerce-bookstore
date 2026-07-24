import { KnowledgeChunk } from '../entities/knowledge-chunk.entity';

export interface IKnowledgeChunkCommandRepository {
  insertMany(chunks: KnowledgeChunk[]): Promise<void>;
  deleteBySourceId(sourceId: string): Promise<void>;
}

export const KNOWLEDGE_CHUNK_COMMAND_REPOSITORY =
  'IKnowledgeChunkCommandRepository';
