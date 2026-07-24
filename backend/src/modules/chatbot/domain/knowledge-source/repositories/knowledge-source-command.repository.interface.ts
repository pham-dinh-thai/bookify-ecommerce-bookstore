import type { KnowledgeSource } from '../knowledge-source.aggregate';

export interface IKnowledgeSourceCommandRepository {
  insert(source: KnowledgeSource): Promise<void>;
  save(source: KnowledgeSource): Promise<void>;
  delete(id: string): Promise<void>;
}

export const KNOWLEDGE_SOURCE_COMMAND_REPOSITORY =
  'IKnowledgeSourceCommandRepository';
