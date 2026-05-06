import { GenreReadModel } from '../read-models/genre.read-model';

export interface IGenresQueryRepository {
  findAll(): Promise<GenreReadModel[]>;

  findOne(id: string): Promise<GenreReadModel | null>;

  count(): Promise<number>;
}

export const GENRES_QUERY_REPOSITORY = 'IGenresQueryRepository';
