export interface IGenresQueryRepository {
  findAll();

  findOne(id: string);
}

export const GENRES_QUERY_REPOSITORY = 'IGenresQueryRepository';
