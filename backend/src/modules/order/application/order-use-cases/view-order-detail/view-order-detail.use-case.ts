import { Inject, Injectable } from '@nestjs/common';
import {
  type IOrdersQueryRepository,
  ORDERS_QUERY_REPOSITORY,
} from '../../../domain/order-aggregate/repositories/orders-query.repository.interface';
import { OrderDetailReadModel } from '../../../domain/order-aggregate/read-models/order-detail.read-model';

@Injectable()
export class ViewOrderDetailUseCase {
  public constructor(
    @Inject(ORDERS_QUERY_REPOSITORY)
    private readonly ordersQueryRepository: IOrdersQueryRepository,
  ) {}

  public async execute(
    id: string,
    userId: string,
  ): Promise<OrderDetailReadModel> {
    const order: OrderDetailReadModel =
      await this.ordersQueryRepository.findOrderDetail(userId, id);

    return order;
  }
}
