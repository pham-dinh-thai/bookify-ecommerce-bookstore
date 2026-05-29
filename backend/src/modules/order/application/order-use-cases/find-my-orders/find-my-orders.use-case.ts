import { Inject, Injectable } from '@nestjs/common';
import { FindMyOrdersResponse } from './find-my-orders.response';
import {
  type IOrdersQueryRepository,
  ORDERS_QUERY_REPOSITORY,
} from '../../../domain/order-aggregate/repositories/orders-query.repository.interface';
import { MyOrderReadModel } from '../../../domain/order-aggregate/read-models/my-order.read-model';

@Injectable()
export class FindMyOrdersUseCase {
  public constructor(
    @Inject(ORDERS_QUERY_REPOSITORY)
    private readonly ordersQueryRepository: IOrdersQueryRepository,
  ) {}

  public async execute(userId: string): Promise<FindMyOrdersResponse> {
    const orders: MyOrderReadModel[] =
      await this.ordersQueryRepository.findUserOrders(userId);

    const response = new FindMyOrdersResponse(orders);

    return response;
  }
}
