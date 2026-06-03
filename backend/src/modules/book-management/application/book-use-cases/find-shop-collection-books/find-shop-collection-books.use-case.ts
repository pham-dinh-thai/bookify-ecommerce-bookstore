import { Inject, Injectable } from '@nestjs/common';
import {
  BOOKS_QUERY_REPOSITORY,
  type IBooksQueryRepository,
} from '../../../domain/book-aggregate/repositories/books-query.repository.interface';
import { BookReadModel } from '../../../domain/book-aggregate/read-models/book.read-model';
import { FindBooksResponse } from '../find-books/find-books.response';

export type ShopCollectionType = 'best-seller' | 'on-sales' | 'new-arrivals';

@Injectable()
export class FindShopCollectionBooksUseCase {
  public constructor(
    @Inject(BOOKS_QUERY_REPOSITORY)
    private readonly booksQueryRepository: IBooksQueryRepository,
  ) {}

  public async execute(
    type: ShopCollectionType,
    page: number,
    limit: number,
  ): Promise<FindBooksResponse> {
    const books = await this.findBooks(type, page, limit);

    return new FindBooksResponse(books, books.length);
  }

  private async findBooks(
    type: ShopCollectionType,
    page: number,
    limit: number,
  ): Promise<BookReadModel[]> {
    if (type === 'best-seller') {
      return this.booksQueryRepository.findBestSellers(page, limit);
    }

    if (type === 'on-sales') {
      return this.booksQueryRepository.findOnSales(page, limit);
    }

    return this.booksQueryRepository.findNewArrivals(page, limit);
  }
}
