import { Injectable } from '@nestjs/common';
import { IOrdersQueryRepository } from '../../../domain/order-aggregate/repositories/orders-query.repository.interface';
import { OrderReadModel } from '../../../domain/order-aggregate/read-models/order.read-model';
import { OrderDetailReadModel } from '../../../domain/order-aggregate/read-models/order-detail.read-model';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTypeOrm } from '../../entities/order.entity';
import { Repository } from 'typeorm';
import { MyOrderReadModel } from '../../../domain/order-aggregate/read-models/my-order.read-model';
import { OrderItemPreviewReadModel } from '../../../domain/order-aggregate/read-models/order-item-preview.read-model';
import { OrdersMapper } from '../../mappers/orders.mapper';

@Injectable()
export class TypeOrmOrdersQueryRepository implements IOrdersQueryRepository {
  public constructor(
    @InjectRepository(OrderTypeOrm)
    private readonly repository: Repository<OrderTypeOrm>,
  ) {}

  public async findAll(): Promise<OrderReadModel[]> {
    throw new Error();
  }

  public async findUserOrders(userId: string): Promise<MyOrderReadModel[]> {
    const ordersTypeOrm: OrderTypeOrm[] = await this.repository.find({
      where: { userId },
      relations: {
        items: {
          product: {
            covers: true,
          },
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return ordersTypeOrm.map((orderTypeOrm) =>
      OrdersMapper.toMyOrderReadModel(orderTypeOrm),
    );
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
