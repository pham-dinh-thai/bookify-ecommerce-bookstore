import { Injectable } from '@nestjs/common';
import { IKnowledgeSourceQueryRepository } from '../../../domain/knowledge-source/repositories/knowledge-source-query.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { KnowledgeSourceTypeOrm } from '../../entities/knowledge-source.entity';
import { Repository } from 'typeorm';
import { KnowledgeMapper } from '../../mappers/knowledge.mapper';
import { KnowledgeSource } from '../../../domain/knowledge-source/knowledge-source.aggregate';

@Injectable()
export class TypeOrmKnowledgeSourceQueryRepository
  implements IKnowledgeSourceQueryRepository
{
  public constructor(
    @InjectRepository(KnowledgeSourceTypeOrm)
    private readonly repository: Repository<KnowledgeSourceTypeOrm>,
  ) {}

  public async findActiveByLanguage(
    language: string,
  ): Promise<KnowledgeSource[]> {
    const entities: KnowledgeSourceTypeOrm[] = await this.repository.find({
      where: { isActive: true, language },
      relations: { chunks: true },
    });

    return entities.map((e) => KnowledgeMapper.sourceToDomain(e, e.chunks));
  }

  public async findAll(): Promise<KnowledgeSource[]> {
    const entities: KnowledgeSourceTypeOrm[] = await this.repository.find({
      relations: { chunks: true },
      order: { createdAt: 'DESC' },
    });

    return entities.map((e) => KnowledgeMapper.sourceToDomain(e, e.chunks));
  }

  public async findOne(id: string): Promise<KnowledgeSource | null> {
    const entity: KnowledgeSourceTypeOrm | null =
      await this.repository.findOne({
        where: { id },
        relations: { chunks: true },
      });

    if (!entity) {
      return null;
    }

    return KnowledgeMapper.sourceToDomain(entity, entity.chunks);
  }
}
