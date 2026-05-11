import { Inject } from '@nestjs/common';
import { IGenreExistsChecker } from '../../../domain/genre-aggregate/services/genre-exists-checker.service';
import {
  GENRES_QUERY_REPOSITORY,
  type IGenresQueryRepository,
} from '../../../domain/genre-aggregate/repositories/genres-query.repository.interface';
import { GenreNotFoundException } from '../../../domain/genre-aggregate/exceptions/genre-not-found.exception';

export class GenreExistsChecker implements IGenreExistsChecker {
  public constructor(
    @Inject(GENRES_QUERY_REPOSITORY)
    private readonly genresQueryRepository: IGenresQueryRepository,
  ) {}

  public async isExists(id: string): Promise<boolean> {
    const genre = await this.genresQueryRepository.findOne(id);

    return !!genre;
  }

  public async existsOrThrow(id: string): Promise<void> {
    const exists = await this.genresQueryRepository.findOne(id);

    if (!exists) {
      throw new GenreNotFoundException();
    }
  }
}
