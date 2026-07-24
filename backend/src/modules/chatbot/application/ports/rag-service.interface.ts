export interface IRAGService {
  retrieveRelevantChunks(query: string, language?: string): Promise<string[]>;
}

export const RAG_SERVICE = 'IRAGService';
