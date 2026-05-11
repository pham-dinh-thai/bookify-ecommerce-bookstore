import { BookReadModel } from '../read-models/book.read-model';

export interface IBooksQueryRepository {
  findAll(): Promise<BookReadModel[]>;

  findOne(id: string): Promise<BookReadModel | null>;

  count(search?: string): Promise<number>;
}

export const BOOKS_QUERY_REPOSITORY = 'IBooksQueryRepository';
