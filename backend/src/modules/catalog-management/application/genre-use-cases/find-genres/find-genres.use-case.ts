import { Inject, Injectable } from '@nestjs/common';
import {
  GENRES_QUERY_REPOSITORY,
  type IGenresQueryRepository,
} from '../../../domain/genre-aggregate/repositories/genres-query.repository.interface';
import { GenreReadModel } from '../../../domain/genre-aggregate/read-models/genre.read-model';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/cache/domain/cache.repository.interface';
import { GENRE_CACHE_KEYS, GENRE_CACHE_TTL } from '../genre-cache.constants';
import { FindGenresResponse } from './find-genres.response';

@Injectable()
export class FindGenresUseCase {
  public constructor(
    @Inject(GENRES_QUERY_REPOSITORY)
    private readonly genresQueryRepository: IGenresQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(
    page: number,
    limit: number,
    search?: string,
  ): Promise<FindGenresResponse> {
    const cacheKey = GENRE_CACHE_KEYS.PAGE(page, limit, search);

    const cached = await this.cacheRepository.get<FindGenresResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const genres = await this.genresQueryRepository.findAll(
      page,
      limit,
      search,
    );
    const total = await this.genresQueryRepository.count(search);

    const response = new FindGenresResponse(genres, total);

    await this.cacheRepository.set(cacheKey, response, GENRE_CACHE_TTL.ALL);

    return response;
  }
}
