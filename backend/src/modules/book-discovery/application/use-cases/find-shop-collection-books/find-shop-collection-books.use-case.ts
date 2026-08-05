import { Inject, Injectable } from '@nestjs/common';
import {
  DISCOVERY_BOOKS_QUERY_REPOSITORY,
  type IDiscoveryBooksQueryRepository,
} from '../../../domain/repositories/books-query.repository.interface';
import { DiscoveryBookCollectionType } from '../../../domain/types';
import { BookReadModel } from '../../../domain/read-models/book.read-model';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import { ShopCollectionResponse } from './find-shop-collection-books.response';

const SHOP_COLLECTION_CACHE_KEYS = {
  PAGE: (type: DiscoveryBookCollectionType, page: number, limit: number) =>
    `shop-collections:${type}:page=${page}:limit=${limit}`,
} as const;

const SHOP_COLLECTION_CACHE_TTL = 60 * 60 * 1000;

@Injectable()
export class FindShopCollectionBooksUseCase {
  public constructor(
    @Inject(DISCOVERY_BOOKS_QUERY_REPOSITORY)
    private readonly booksQueryRepository: IDiscoveryBooksQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(
    type: DiscoveryBookCollectionType,
    page: number,
    limit: number,
  ): Promise<ShopCollectionResponse> {
    const cacheKey = SHOP_COLLECTION_CACHE_KEYS.PAGE(type, page, limit);

    const cached =
      await this.cacheRepository.get<ShopCollectionResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const books = await this.findBooks(type, page, limit);
    const total = books.length;

    const response = new ShopCollectionResponse(books, total);

    await this.cacheRepository.set(
      cacheKey,
      response,
      SHOP_COLLECTION_CACHE_TTL,
    );

    return response;
  }

  private async findBooks(
    type: DiscoveryBookCollectionType,
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
