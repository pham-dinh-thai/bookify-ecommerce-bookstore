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

  public async findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<PublisherReadModel[]> {
    const query = this.repository.createQueryBuilder('publisher');

    if (search) {
      query.where('publisher.name LIKE :search', { search: `%${search}%` });
    }

    const publishersTypeOrm = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return publishersTypeOrm.map((publisherTypeOrm) =>
      PublishersMapper.toReadModel(publisherTypeOrm),
    );
  }

  public async findOne(id: string): Promise<PublisherReadModel | null> {
    const publisherTypeOrm = await this.repository.findOne({ where: { id } });

    return publisherTypeOrm
      ? PublishersMapper.toReadModel(publisherTypeOrm)
      : null;
  }

  public async count(search?: string): Promise<number> {
    const query = this.repository.createQueryBuilder('publisher');

    if (search) {
      query.where('publisher.name LIKE :search', { search: `%${search}%` });
    }

    return await query.getCount();
  }
}
