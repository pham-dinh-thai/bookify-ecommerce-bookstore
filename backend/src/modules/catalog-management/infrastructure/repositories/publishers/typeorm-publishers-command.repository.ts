import { Injectable } from '@nestjs/common';
import { IPublishersCommandRepository } from '../../../domain/publisher-aggregate/repositories/publishers-command.repository.inerface';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { Publisher } from '../../../domain/publisher-aggregate/publisher.aggregate';
import { PublisherTypeOrm } from '../../entities/publisher.entity';
import { PublishersMapper } from '../../mappers/publishers.mapper';
import { PublisherNotFoundException } from '../../../domain/publisher-aggregate/exceptions/publisher-not-found.exception';

@Injectable()
export class TypeOrmPublishersCommandRepository implements IPublishersCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findOne(id: string): Promise<Publisher> {
    const publisherTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(PublisherTypeOrm, { where: { id } });

    if (!publisherTypeOrm) {
      throw new PublisherNotFoundException();
    }

    return PublishersMapper.toDomain(publisherTypeOrm);
  }

  public async save(publisher: Publisher): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(PublisherTypeOrm, PublishersMapper.toTypeOrm(publisher));
  }

  public async delete(publisher: Publisher): Promise<void> {
    await this.unitOfWork
      .getManager()
      .delete(PublisherTypeOrm, { id: publisher.getId() });
  }
}
