import { BookReadModel } from '../read-models/book.read-model';
import { BookStockAlertsReadModel } from '../read-models/book-stock-alerts.read-model';

export interface IBooksQueryRepository {
  findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<BookReadModel[]>;

  findOne(id: string): Promise<BookReadModel | null>;

  count(search?: string): Promise<number>;

  findBestSellers(page: number, limit: number): Promise<BookReadModel[]>;

  findNewArrivals(page: number, limit: number): Promise<BookReadModel[]>;

  findOnSales(page: number, limit: number): Promise<BookReadModel[]>;

  findStockAlerts(
    lowStockThreshold: number,
    lowStockBookLimit: number,
  ): Promise<BookStockAlertsReadModel>;
}

export const BOOKS_QUERY_REPOSITORY = 'IBooksQueryRepository';
