import { KnowledgeSourceType } from './enums/knowledge-source-type.enum';
import { KnowledgeChunk } from './entities/knowledge-chunk.entity';

export class KnowledgeSource {
  private constructor(
    private readonly id: string,
    private sourceType: KnowledgeSourceType,
    private title: string,
    private content: string,
    private language: string,
    private isActive: boolean,
    private chunks: KnowledgeChunk[],
  ) {}

  public static create(props: {
    id: string;
    sourceType: KnowledgeSourceType;
    title: string;
    content: string;
    language?: string;
  }): KnowledgeSource {
    return new KnowledgeSource(
      props.id,
      props.sourceType,
      props.title,
      props.content,
      props.language ?? 'vi',
      true,
      [],
    );
  }

  public static fromPersistent(props: {
    id: string;
    sourceType: KnowledgeSourceType;
    title: string;
    content: string;
    language: string;
    isActive: boolean;
    chunks: KnowledgeChunk[];
  }): KnowledgeSource {
    return new KnowledgeSource(
      props.id,
      props.sourceType,
      props.title,
      props.content,
      props.language,
      props.isActive,
      props.chunks,
    );
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public activate(): void {
    this.isActive = true;
  }

  public replaceChunks(chunks: KnowledgeChunk[]): void {
    this.chunks = chunks;
  }

  public findRelevantChunks(
    queryEmbedding: number[],
    topK: number,
  ): string[] {
    if (this.chunks.length === 0) {
      return [];
    }

    const scored = this.chunks
      .map((chunk) => ({
        content: chunk.getContent(),
        score: this.cosineSimilarity(queryEmbedding, chunk.getEmbedding()),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return scored.map((s) => s.content);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length || a.length === 0) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);

    return denominator === 0 ? 0 : dotProduct / denominator;
  }

  public getId(): string {
    return this.id;
  }

  public getSourceType(): KnowledgeSourceType {
    return this.sourceType;
  }

  public getTitle(): string {
    return this.title;
  }

  public getContent(): string {
    return this.content;
  }

  public getLanguage(): string {
    return this.language;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getChunks(): KnowledgeChunk[] {
    return [...this.chunks];
  }
}
