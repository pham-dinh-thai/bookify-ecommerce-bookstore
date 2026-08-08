import { BookReadModel } from '../read-models/book.read-model';
import { BookStockAlertsReadModel } from '../read-models/book-stock-alerts.read-model';

export interface IBooksQueryRepository {
  findAll(
    page: number,
    limit: number,
    search?: string,
    genre?: string,
  ): Promise<BookReadModel[]>;

  findOne(id: string): Promise<BookReadModel | null>;

  count(search?: string, genre?: string): Promise<number>;

  findStockAlerts(
    lowStockThreshold: number,
    lowStockBookLimit: number,
  ): Promise<BookStockAlertsReadModel>;
}

export const BOOKS_QUERY_REPOSITORY = 'IBooksQueryRepository';
