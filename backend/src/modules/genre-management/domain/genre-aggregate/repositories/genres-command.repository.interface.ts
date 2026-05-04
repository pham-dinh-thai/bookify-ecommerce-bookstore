import { Genre } from '../genre.aggregate';

export interface IGenresCommandRepository {
  findOne(id: string): Promise<Genre>;

  save(genre: Genre): Promise<void>;

  delele(genre: Genre): Promise<void>;
}

export const GENRES_COMMAND_REPOSITORY = 'IGenresCommandRepository';
