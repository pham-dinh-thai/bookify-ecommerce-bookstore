import type { KnowledgeSource } from '../../domain/knowledge-source/knowledge-source.aggregate';

export interface IKnowledgeIngestionService {
  ingest(source: KnowledgeSource): Promise<void>;
}

export const KNOWLEDGE_INGESTION_SERVICE = 'IKnowledgeIngestionService';
