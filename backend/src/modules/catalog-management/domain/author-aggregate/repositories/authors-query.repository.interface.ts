import { AuthorReadModel } from '../read-models/author.read-model';

export interface IAuthorsQueryRepository {
  findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<AuthorReadModel[]>;

  findOne(id: string): Promise<AuthorReadModel | null>;

  count(search?: string): Promise<number>;
}

export const AUTHORS_QUERY_REPOSITORY = 'IAuthorsQueryRepository';
