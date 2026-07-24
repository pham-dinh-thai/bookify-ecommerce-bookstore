export class ListKnowledgeSourcesResponse {
  constructor(
    public readonly sources: {
      id: string;
      sourceType: string;
      title: string;
      content: string;
      language: string;
      isActive: boolean;
      chunkCount: number;
    }[],
  ) {}
}
