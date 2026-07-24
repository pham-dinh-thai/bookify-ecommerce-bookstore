export class KnowledgeChunk {
  private constructor(
    private readonly id: string,
    private readonly sourceId: string,
    private readonly chunkIndex: number,
    private readonly content: string,
    private readonly tokenCount: number,
    private readonly embedding: number[],
  ) {}

  public static create(props: {
    id: string;
    sourceId: string;
    chunkIndex: number;
    content: string;
    tokenCount: number;
    embedding: number[];
  }): KnowledgeChunk {
    return new KnowledgeChunk(
      props.id,
      props.sourceId,
      props.chunkIndex,
      props.content,
      props.tokenCount,
      props.embedding,
    );
  }

  public static fromPersistent(props: {
    id: string;
    sourceId: string;
    chunkIndex: number;
    content: string;
    tokenCount: number;
    embedding: number[];
  }): KnowledgeChunk {
    return new KnowledgeChunk(
      props.id,
      props.sourceId,
      props.chunkIndex,
      props.content,
      props.tokenCount,
      props.embedding,
    );
  }

  public getId(): string {
    return this.id;
  }

  public getSourceId(): string {
    return this.sourceId;
  }

  public getChunkIndex(): number {
    return this.chunkIndex;
  }

  public getContent(): string {
    return this.content;
  }

  public getTokenCount(): number {
    return this.tokenCount;
  }

  public getEmbedding(): number[] {
    return [...this.embedding];
  }
}
