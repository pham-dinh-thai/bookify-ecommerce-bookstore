import { Author } from '../author.aggregate';

export interface IAuthorsCommandRepository {
  findOne(id: string): Promise<Author>;

  save(author: Author): Promise<void>;

  delete(author: Author): Promise<void>;
}

export const AUTHORS_COMMAND_REPOSITORY = 'IAuthorsCommandRepository';
