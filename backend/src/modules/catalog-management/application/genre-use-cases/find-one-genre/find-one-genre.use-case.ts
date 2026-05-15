import { Inject, Injectable } from '@nestjs/common';
import {
  GENRES_QUERY_REPOSITORY,
  type IGenresQueryRepository,
} from '../../../domain/genre-aggregate/repositories/genres-query.repository.interface';
import { GenreReadModel } from '../../../domain/genre-aggregate/read-models/genre.read-model';

/**
 * Retrieves a single genre by ID, or null if not found.
 */
@Injectable()
export class FindOneGenreUseCase {
  public constructor(
    @Inject(GENRES_QUERY_REPOSITORY)
    private readonly repository: IGenresQueryRepository,
  ) {}

  public async execute(id: string): Promise<GenreReadModel | null> {
    const genres = await this.repository.findOne(id);

    return genres;
  }
}
