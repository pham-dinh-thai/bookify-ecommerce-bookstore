import { Injectable } from '@nestjs/common';
import { IPublishersQueryRepository } from '../../../domain/publisher-aggregate/repositories/publishers-query.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { PublisherTypeOrm } from '../../entities/publisher.entity';
import { Repository } from 'typeorm';
import { PublisherReadModel } from '../../../domain/publisher-aggregate/read-models/publisher.read-model';
import { PublishersMapper } from '../../mappers/publishers.mapper';

@Injectable()
export class TypeOrmPublishersQueryRepository implements IPublishersQueryRepository {
  public constructor(
    @InjectRepository(PublisherTypeOrm)
    private readonly repository: Repository<PublisherTypeOrm>,
  ) {}

  public async findAll(): Promise<PublisherReadModel[]> {
    const publishersTypeOrm = await this.repository.find();

    return publishersTypeOrm
      ? publishersTypeOrm.map((publisherTypeOrm) =>
          PublishersMapper.toReadModel(publisherTypeOrm),
        )
      : [];
  }

  public async findOne(id: string): Promise<PublisherReadModel | null> {
    const publisherTypeOrm = await this.repository.findOne({ where: { id } });

    return publisherTypeOrm
      ? PublishersMapper.toReadModel(publisherTypeOrm)
      : null;
  }
}
