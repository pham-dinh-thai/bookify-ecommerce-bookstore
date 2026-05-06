import { Inject, Injectable } from '@nestjs/common';
import {
  GENRES_QUERY_REPOSITORY,
  type IGenresQueryRepository,
} from '../../../domain/genre-aggregate/repositories/genres-query.repository.interface';

@Injectable()
export class FindTotalGenreUseCase {
  public constructor(
    @Inject(GENRES_QUERY_REPOSITORY)
    private readonly repository: IGenresQueryRepository,
  ) {}

  public async execute(): Promise<number> {
    const total = await this.repository.count();

    return total;
  }
}
