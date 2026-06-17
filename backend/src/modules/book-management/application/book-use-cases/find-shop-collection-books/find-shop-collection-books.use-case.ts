import { Inject, Injectable } from '@nestjs/common';
import {
  BOOKS_QUERY_REPOSITORY,
  type IBooksQueryRepository,
} from '../../../domain/book-aggregate/repositories/books-query.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import { BookReadModel } from '../../../domain/book-aggregate/read-models/book.read-model';
import { FindBooksResponse } from '../find-books/find-books.response';

export type ShopCollectionType = 'best-seller' | 'on-sales' | 'new-arrivals';

const SHOP_COLLECTION_CACHE_KEYS = {
  PAGE: (type: ShopCollectionType, page: number, limit: number) =>
    `shop-collections:${type}:page=${page}:limit=${limit}`,
} as const;

const SHOP_COLLECTION_CACHE_TTL = 60 * 60 * 1000;

@Injectable()
export class FindShopCollectionBooksUseCase {
  public constructor(
    @Inject(BOOKS_QUERY_REPOSITORY)
    private readonly booksQueryRepository: IBooksQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(
    type: ShopCollectionType,
    page: number,
    limit: number,
  ): Promise<FindBooksResponse> {
    const cacheKey = SHOP_COLLECTION_CACHE_KEYS.PAGE(type, page, limit);

    const cached = await this.cacheRepository.get<FindBooksResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const books = await this.findBooks(type, page, limit);
    const total = books.length;

    const response = new FindBooksResponse(books, total);

    await this.cacheRepository.set(
      cacheKey,
      response,
      SHOP_COLLECTION_CACHE_TTL,
    );

    return response;
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
