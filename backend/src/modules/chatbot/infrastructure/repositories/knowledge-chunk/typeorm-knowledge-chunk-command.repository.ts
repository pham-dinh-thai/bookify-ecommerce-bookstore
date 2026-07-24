import { Injectable } from '@nestjs/common';
import { IKnowledgeChunkCommandRepository } from '../../../domain/knowledge-source/repositories/knowledge-chunk-command.repository.interface';
import { KnowledgeChunk } from '../../../domain/knowledge-source/entities/knowledge-chunk.entity';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { KnowledgeChunkTypeOrm } from '../../entities/knowledge-chunk.entity';
import { KnowledgeMapper } from '../../mappers/knowledge.mapper';

@Injectable()
export class TypeOrmKnowledgeChunkCommandRepository
  implements IKnowledgeChunkCommandRepository
{
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async insertMany(chunks: KnowledgeChunk[]): Promise<void> {
    const entities = chunks.map((c) => KnowledgeMapper.chunkToTypeOrm(c));

    await this.unitOfWork.getManager().insert(KnowledgeChunkTypeOrm, entities);
  }

  public async deleteBySourceId(sourceId: string): Promise<void> {
    await this.unitOfWork
      .getManager()
      .delete(KnowledgeChunkTypeOrm, { sourceId });
  }
}
