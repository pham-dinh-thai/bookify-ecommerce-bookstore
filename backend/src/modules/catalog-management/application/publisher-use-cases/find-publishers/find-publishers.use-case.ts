import { Inject, Injectable } from '@nestjs/common';
import {
  type IPublishersQueryRepository,
  PUBLISHERS_QUERY_REPOSITORY,
} from '../../../domain/publisher-aggregate/repositories/publishers-query.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import {
  PUBLISHER_CACHE_KEYS,
  PUBLISHER_CACHE_TTL,
} from '../publisher-cache.constants';
import { FindPublishersResponse } from './find-publishers.response';

/**
 * Retrieves a paginated list of publishers, with optional name search.
 *
 * Results are cached per unique combination of page, limit, and search term
 * to reduce database load on repeated queries.
 */
@Injectable()
export class FindPublishersUseCase {
  public constructor(
    @Inject(PUBLISHERS_QUERY_REPOSITORY)
    private readonly publishersQueryRepository: IPublishersQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(
    page: number,
    limit: number,
    search?: string,
  ): Promise<FindPublishersResponse> {
    const cacheKey = PUBLISHER_CACHE_KEYS.PAGE(page, limit, search);

    const cached =
      await this.cacheRepository.get<FindPublishersResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const publishers = await this.publishersQueryRepository.findAll(
      page,
      limit,
      search,
    );
    const total = await this.publishersQueryRepository.count(search);

    const response = new FindPublishersResponse(publishers, total);

    await this.cacheRepository.set(cacheKey, response, PUBLISHER_CACHE_TTL.ALL);

    return response;
  }
}
