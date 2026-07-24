import { Injectable } from '@nestjs/common';
import { IKnowledgeChunkQueryRepository } from '../../../domain/knowledge-source/repositories/knowledge-chunk-query.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { KnowledgeChunkTypeOrm } from '../../entities/knowledge-chunk.entity';
import { Repository } from 'typeorm';
import { KnowledgeChunk } from '../../../domain/knowledge-source/entities/knowledge-chunk.entity';

@Injectable()
export class TypeOrmKnowledgeChunkQueryRepository
  implements IKnowledgeChunkQueryRepository
{
  public constructor(
    @InjectRepository(KnowledgeChunkTypeOrm)
    private readonly repository: Repository<KnowledgeChunkTypeOrm>,
  ) {}

  public async findRelevantChunks(
    embedding: number[],
    topK: number,
  ): Promise<KnowledgeChunk[]> {
    const entities: KnowledgeChunkTypeOrm[] = await this.repository
      .createQueryBuilder('chunk')
      .innerJoinAndSelect('chunk.source', 'source')
      .where('source.isActive = :isActive', { isActive: true })
      .getMany();

    const scored = entities
      .map((e) => ({
        entity: e,
        score: this.cosineSimilarity(embedding, e.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return scored.map(({ entity }) =>
      KnowledgeChunk.fromPersistent({
        id: entity.id,
        sourceId: entity.sourceId,
        chunkIndex: entity.chunkIndex,
        content: entity.content,
        tokenCount: entity.tokenCount,
        embedding: entity.embedding,
      }),
    );
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
}
