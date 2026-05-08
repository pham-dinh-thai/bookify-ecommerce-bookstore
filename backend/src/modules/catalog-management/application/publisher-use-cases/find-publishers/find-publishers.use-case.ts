import { Inject, Injectable } from '@nestjs/common';
import {
  type IPublishersQueryRepository,
  PUBLISHERS_QUERY_REPOSITORY,
} from '../../../domain/publisher-aggregate/repositories/publishers-query.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/cache/domain/cache.repository.interface';
import { PublisherReadModel } from '../../../domain/publisher-aggregate/read-models/publisher.read-model';
import {
  PUBLISHER_CACHE_KEYS,
  PUBLISHER_CACHE_TTL,
} from '../publisher-cache.constants';

@Injectable()
export class FindPublishersUseCase {
  public constructor(
    @Inject(PUBLISHERS_QUERY_REPOSITORY)
    private readonly publishersQueryRepository: IPublishersQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(): Promise<PublisherReadModel[]> {
    const cached = await this.cacheRepository.get<PublisherReadModel[]>(
      PUBLISHER_CACHE_KEYS.ALL,
    );
    if (cached) {
      return cached;
    }

    const publishers = await this.publishersQueryRepository.findAll();

    await this.cacheRepository.set(
      PUBLISHER_CACHE_KEYS.ALL,
      publishers,
      PUBLISHER_CACHE_TTL.ALL,
    );

    return publishers;
  }
}
