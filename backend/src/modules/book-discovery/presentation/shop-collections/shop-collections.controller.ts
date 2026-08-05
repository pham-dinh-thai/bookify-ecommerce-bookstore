import { Controller, Get, Query } from '@nestjs/common';
import { FindShopCollectionBooksUseCase } from '../../application/use-cases/find-shop-collection-books/find-shop-collection-books.use-case';
import type { ShopCollectionResponse } from '../../application/use-cases/find-shop-collection-books/find-shop-collection-books.response';
import type { DiscoveryBookCollectionType } from '../../domain/types';

@Controller()
export class ShopCollectionsController {
  public constructor(
    private readonly findShopCollectionBooksUseCase: FindShopCollectionBooksUseCase,
  ) {}

  @Get('best-seller')
  public async findBestSeller(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<ShopCollectionResponse> {
    return this.findCollection('best-seller', page, limit);
  }

  @Get('on-sales')
  public async findOnSales(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ): Promise<ShopCollectionResponse> {
    return this.findCollection('on-sales', page, limit);
  }

  @Get('new-arrivals')
  public async findNewArrivals(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ): Promise<ShopCollectionResponse> {
    return this.findCollection('new-arrivals', page, limit);
  }

  private async findCollection(
    type: DiscoveryBookCollectionType,
    page: string,
    limit: string,
  ): Promise<ShopCollectionResponse> {
    return this.findShopCollectionBooksUseCase.execute(
      type,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }
}
