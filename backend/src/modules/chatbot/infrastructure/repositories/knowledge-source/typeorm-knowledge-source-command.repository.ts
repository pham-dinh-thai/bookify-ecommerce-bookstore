import { Injectable } from '@nestjs/common';
import { IKnowledgeSourceCommandRepository } from '../../../domain/knowledge-source/repositories/knowledge-source-command.repository.interface';
import { KnowledgeSource } from '../../../domain/knowledge-source/knowledge-source.aggregate';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { KnowledgeSourceTypeOrm } from '../../entities/knowledge-source.entity';
import { KnowledgeMapper } from '../../mappers/knowledge.mapper';

@Injectable()
export class TypeOrmKnowledgeSourceCommandRepository
  implements IKnowledgeSourceCommandRepository
{
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async insert(source: KnowledgeSource): Promise<void> {
    const entity = KnowledgeMapper.sourceToTypeOrm(source);

    await this.unitOfWork.getManager().insert(KnowledgeSourceTypeOrm, entity);
  }

  public async save(source: KnowledgeSource): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(KnowledgeSourceTypeOrm, KnowledgeMapper.sourceToTypeOrm(source));
  }

  public async delete(id: string): Promise<void> {
    await this.unitOfWork
      .getManager()
      .delete(KnowledgeSourceTypeOrm, { id });
  }
}
