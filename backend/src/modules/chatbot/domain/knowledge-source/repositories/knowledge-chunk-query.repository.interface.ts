import type { KnowledgeChunk } from '../entities/knowledge-chunk.entity';

export interface IKnowledgeChunkQueryRepository {
  findRelevantChunks(
    embedding: number[],
    topK: number,
  ): Promise<KnowledgeChunk[]>;
}

export const KNOWLEDGE_CHUNK_QUERY_REPOSITORY =
  'IKnowledgeChunkQueryRepository';
