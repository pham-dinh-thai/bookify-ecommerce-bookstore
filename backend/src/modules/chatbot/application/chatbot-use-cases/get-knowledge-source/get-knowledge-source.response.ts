export class GetKnowledgeSourceResponse {
  constructor(
    public readonly source: {
      id: string;
      sourceType: string;
      title: string;
      content: string;
      language: string;
      isActive: boolean;
      chunkCount: number;
    },
  ) {}
}
