export class CreateKnowledgeSourceResponse {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly chunkCount: number,
  ) {}
}
