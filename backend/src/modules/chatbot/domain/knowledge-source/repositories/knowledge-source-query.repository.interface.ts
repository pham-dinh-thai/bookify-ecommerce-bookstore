import type { KnowledgeSource } from '../knowledge-source.aggregate';

export interface IKnowledgeSourceQueryRepository {
  findActiveByLanguage(language: string): Promise<KnowledgeSource[]>;
  findAll(): Promise<KnowledgeSource[]>;
  findOne(id: string): Promise<KnowledgeSource | null>;
}

export const KNOWLEDGE_SOURCE_QUERY_REPOSITORY =
  'IKnowledgeSourceQueryRepository';
