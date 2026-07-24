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

  public updateTitle(title: string): void {
    this.title = title;
  }

  public updateContent(content: string): void {
    this.content = content;
  }

  public updateLanguage(language: string): void {
    this.language = language;
  }

  public updateSourceType(sourceType: KnowledgeSourceType): void {
    this.sourceType = sourceType;
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

  /**
   * Split content into text chunks. Pure domain logic.
   * Splits on double newlines (paragraphs), falls back to single newlines,
   * then hard-cuts at max length.
   */
  public chunkContent(maxLength: number = 800): string[] {
    const text = this.content.trim();

    if (text.length === 0) {
      return [];
    }

    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

    const chunks: string[] = [];
    let buffer = '';

    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();

      if (trimmed.length > maxLength) {
        if (buffer.length > 0) {
          chunks.push(buffer.trim());
          buffer = '';
        }

        const sentences = trimmed.split(/(?<=[.!?])\s+/);

        for (const sentence of sentences) {
          if (buffer.length + sentence.length + 1 > maxLength && buffer.length > 0) {
            chunks.push(buffer.trim());
            buffer = '';
          }

          buffer += (buffer.length > 0 ? ' ' : '') + sentence;
        }
      } else if (buffer.length + trimmed.length + 2 > maxLength && buffer.length > 0) {
        chunks.push(buffer.trim());
        buffer = trimmed;
      } else {
        buffer += (buffer.length > 0 ? '\n\n' : '') + trimmed;
      }
    }

    if (buffer.trim().length > 0) {
      chunks.push(buffer.trim());
    }

    return chunks;
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
