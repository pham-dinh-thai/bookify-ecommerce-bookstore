import { GenreReadModel } from '../read-models/genre.read-model';

export interface IGenresQueryRepository {
  findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<GenreReadModel[]>;

  findOne(id: string): Promise<GenreReadModel | null>;

  count(search?: string): Promise<number>;
}

export const GENRES_QUERY_REPOSITORY = 'IGenresQueryRepository';
