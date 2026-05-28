import { Injectable } from '@nestjs/common';
import { IOrdersQueryRepository } from '../../../domain/order-aggregate/repositories/orders-query.repository.interface';
import { OrderReadModel } from '../../../domain/order-aggregate/read-models/order.read-model';
import { OrderDetailReadModel } from '../../../domain/order-aggregate/read-models/order-detail.read-model';

@Injectable()
export class TypeOrmOrdersQueryRepository implements IOrdersQueryRepository {
  public async findAll(): Promise<OrderReadModel[]> {
    throw new Error();
  }

  public async findOne(id: string): Promise<OrderReadModel | null> {
    throw new Error();
  }

  public async findOrderDetail(
    orderId: string,
  ): Promise<OrderDetailReadModel | null> {
    throw new Error();
  }
}
