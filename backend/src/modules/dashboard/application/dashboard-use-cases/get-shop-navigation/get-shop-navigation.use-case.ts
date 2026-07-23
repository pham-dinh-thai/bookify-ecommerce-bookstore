import { Inject, Injectable } from '@nestjs/common';
import {
  ORDERS_QUERY_REPOSITORY,
  type IOrdersQueryRepository,
} from '../../../../order/domain/order-aggregate/repositories/orders-query.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import { GetShopNavigationResponse } from './get-shop-navigation.response';

const SHOP_NAVIGATION_CACHE_KEY = 'shop-navigation';
const SHOP_NAVIGATION_CACHE_TTL = 60 * 60 * 1000;

@Injectable()
export class GetShopNavigationUseCase {
  private static readonly TOP_GENRE_LIMIT = 5;
  private static readonly TOP_AUTHOR_LIMIT = 5;
  private static readonly SALES_LOOKBACK_DAYS = 30;

  public constructor(
    @Inject(ORDERS_QUERY_REPOSITORY)
    private readonly ordersQueryRepository: IOrdersQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(): Promise<GetShopNavigationResponse> {
    const cached = await this.cacheRepository.get<GetShopNavigationResponse>(
      SHOP_NAVIGATION_CACHE_KEY,
    );
    if (cached) {
      return cached;
    }

    const salesSince = this.getSalesSinceDate();
    const [topGenres, topAuthors] = await Promise.all([
      this.ordersQueryRepository.findTopGenresByUnitsSold(
        GetShopNavigationUseCase.TOP_GENRE_LIMIT,
        salesSince,
      ),
      this.ordersQueryRepository.findTopAuthorsByUnitsSold(
        GetShopNavigationUseCase.TOP_AUTHOR_LIMIT,
        salesSince,
      ),
    ]);

    const response = new GetShopNavigationResponse(topGenres, topAuthors);

    await this.cacheRepository.set(
      SHOP_NAVIGATION_CACHE_KEY,
      response,
      SHOP_NAVIGATION_CACHE_TTL,
    );

    return response;
  }

  private getSalesSinceDate(): Date {
    const since = new Date();
    since.setDate(
      since.getDate() - GetShopNavigationUseCase.SALES_LOOKBACK_DAYS,
    );

    return since;
  }
}
