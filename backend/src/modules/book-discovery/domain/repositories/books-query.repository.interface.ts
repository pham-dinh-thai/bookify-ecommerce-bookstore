import { BookReadModel } from '../read-models/book.read-model';

export interface IDiscoveryBooksQueryRepository {
  findBestSellers(page: number, limit: number): Promise<BookReadModel[]>;

  findOnSales(page: number, limit: number): Promise<BookReadModel[]>;

  findNewArrivals(page: number, limit: number): Promise<BookReadModel[]>;

  findByGenres(
    genreIds: string[],
    excludedBookIds: string[],
    page: number,
    limit: number,
  ): Promise<BookReadModel[]>;

  findRandom(page: number, limit: number): Promise<BookReadModel[]>;

  countNewArrivals(): Promise<number>;

  countOnSales(): Promise<number>;

  countBestSellers(): Promise<number>;
}

export const DISCOVERY_BOOKS_QUERY_REPOSITORY =
  'IDiscoveryBooksQueryRepository';
