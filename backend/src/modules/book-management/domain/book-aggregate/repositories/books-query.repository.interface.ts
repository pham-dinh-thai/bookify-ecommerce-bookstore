import { BookReadModel } from '../read-models/book.read-model';

export interface IBooksQueryRepository {
  findAll(): Promise<BookReadModel[]>;

  findOne(id: string): Promise<BookReadModel | null>;
}

export const BOOKS_QUERY_REPOSITORY = 'IBooksQueryRepository';
