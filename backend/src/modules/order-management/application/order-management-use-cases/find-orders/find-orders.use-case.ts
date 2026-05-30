import { Inject, Injectable } from '@nestjs/common';
import { FindOrdersResponse } from './find-orders.response';
import {
  ORDERS_QUERY_REPOSITORY,
  type IOrdersQueryRepository,
} from '../../../../order/domain/order-aggregate/repositories/orders-query.repository.interface';
import { OrderReadModel } from '../../../../order/domain/order-aggregate/read-models/order.read-model';

@Injectable()
export class FindOrdersUseCase {
  public constructor(
    @Inject(ORDERS_QUERY_REPOSITORY)
    private readonly ordersQueryRepository: IOrdersQueryRepository,
  ) {}

  public async execute(): Promise<FindOrdersResponse> {
    const orders: OrderReadModel[] = await this.ordersQueryRepository.findAll();

    const response = new FindOrdersResponse(orders);

    return response;
  }
}
