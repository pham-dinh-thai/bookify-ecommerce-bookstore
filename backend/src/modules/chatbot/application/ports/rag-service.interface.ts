export interface IRAGService {
  retrieveRelevantChunks(query: string): Promise<string[]>;
}

export const RAG_SERVICE = 'IRAGService';
