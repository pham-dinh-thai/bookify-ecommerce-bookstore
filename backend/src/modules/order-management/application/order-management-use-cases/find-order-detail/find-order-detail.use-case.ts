import { Inject, Injectable } from '@nestjs/common';
import {
  ORDERS_QUERY_REPOSITORY,
  type IOrdersQueryRepository,
} from '../../../../order/domain/order-aggregate/repositories/orders-query.repository.interface';
import { OrderDetailReadModel } from '../../../../order/domain/order-aggregate/read-models/order-detail.read-model';

@Injectable()
export class FindOrderDetailUseCase {
  public constructor(
    @Inject(ORDERS_QUERY_REPOSITORY)
    private readonly ordersQueryRepository: IOrdersQueryRepository,
  ) {}

  public async execute(id: string): Promise<OrderDetailReadModel> {
    const order: OrderDetailReadModel =
      await this.ordersQueryRepository.findOrderDetailById(id);

    return order;
  }
}
