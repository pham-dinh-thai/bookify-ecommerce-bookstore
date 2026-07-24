export class KnowledgeSourceReadModel {
  constructor(
    public readonly id: string,
    public readonly sourceType: string,
    public readonly title: string,
    public readonly content: string,
    public readonly language: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
