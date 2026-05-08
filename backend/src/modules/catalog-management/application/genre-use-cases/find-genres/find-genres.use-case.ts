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

@Injectable()
export class FindGenresUseCase {
  public constructor(
    @Inject(GENRES_QUERY_REPOSITORY)
    private readonly repository: IGenresQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(): Promise<GenreReadModel[]> {
    const cached = await this.cacheRepository.get<GenreReadModel[]>(
      GENRE_CACHE_KEYS.ALL,
    );
    if (cached) {
      return cached;
    }

    const genres = await this.repository.findAll();

    await this.cacheRepository.set(
      GENRE_CACHE_KEYS.ALL,
      genres,
      GENRE_CACHE_TTL.ALL,
    );

    return genres;
  }
}
