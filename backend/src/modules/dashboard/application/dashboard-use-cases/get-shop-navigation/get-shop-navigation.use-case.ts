import { Inject, Injectable } from '@nestjs/common';
import {
  ORDERS_QUERY_REPOSITORY,
  type IOrdersQueryRepository,
} from '../../../../order/domain/order-aggregate/repositories/orders-query.repository.interface';
import { GetShopNavigationResponse } from './get-shop-navigation.response';

@Injectable()
export class GetShopNavigationUseCase {
  private static readonly TOP_GENRE_LIMIT = 5;
  private static readonly TOP_AUTHOR_LIMIT = 5;
  private static readonly SALES_LOOKBACK_DAYS = 30;

  public constructor(
    @Inject(ORDERS_QUERY_REPOSITORY)
    private readonly ordersQueryRepository: IOrdersQueryRepository,
  ) {}

  public async execute(): Promise<GetShopNavigationResponse> {
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

    return new GetShopNavigationResponse(topGenres, topAuthors);
  }

  private getSalesSinceDate(): Date {
    const since = new Date();
    since.setDate(
      since.getDate() - GetShopNavigationUseCase.SALES_LOOKBACK_DAYS,
    );

    return since;
  }
}
