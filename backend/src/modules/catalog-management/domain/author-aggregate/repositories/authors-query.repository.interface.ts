import { AuthorReadModel } from '../read-models/author.read-model';

export interface IAuthorsQueryRepository {
  findAll(): Promise<AuthorReadModel[]>;

  findOne(id: string): Promise<AuthorReadModel | null>;

  count(): Promise<number>;
}

export const AUTHORS_QUERY_REPOSITORY = 'IAuthorsQueryRepository';
