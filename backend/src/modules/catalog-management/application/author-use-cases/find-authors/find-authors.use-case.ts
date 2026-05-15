import { Inject, Injectable } from '@nestjs/common';
import {
  AUTHORS_QUERY_REPOSITORY,
  type IAuthorsQueryRepository,
} from '../../../domain/author-aggregate/repositories/authors-query.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import { AUTHOR_CACHE_KEYS, AUTHOR_CACHE_TTL } from '../author-cache.constants';
import { FindAuthorsResponse } from './find-authors.response';

/**
 * Retrieves a paginated list of authors, with optional name search.
 *
 * Results are cached per unique combination of page, limit, and search term
 * to reduce database load on repeated queries.
 */
@Injectable()
export class FindAuthorsUseCase {
  public constructor(
    @Inject(AUTHORS_QUERY_REPOSITORY)
    private readonly authorsQueryRepository: IAuthorsQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(
    page: number,
    limit: number,
    search?: string,
  ): Promise<FindAuthorsResponse> {
    const cacheKey = AUTHOR_CACHE_KEYS.PAGE(page, limit, search);

    const cached =
      await this.cacheRepository.get<FindAuthorsResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const authors = await this.authorsQueryRepository.findAll(
      page,
      limit,
      search,
    );
    const total = await this.authorsQueryRepository.count(search);

    const response = new FindAuthorsResponse(authors, total);

    await this.cacheRepository.set(cacheKey, response, AUTHOR_CACHE_TTL.ALL);

    return response;
  }
}
