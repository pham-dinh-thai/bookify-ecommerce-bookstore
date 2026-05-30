import { Injectable } from '@nestjs/common';
import { IOrdersQueryRepository } from '../../../domain/order-aggregate/repositories/orders-query.repository.interface';
import { OrderReadModel } from '../../../domain/order-aggregate/read-models/order.read-model';
import { OrderDetailReadModel } from '../../../domain/order-aggregate/read-models/order-detail.read-model';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTypeOrm } from '../../entities/order.entity';
import { Repository } from 'typeorm';
import { MyOrderReadModel } from '../../../domain/order-aggregate/read-models/my-order.read-model';
import { OrdersMapper } from '../../mappers/orders.mapper';
import { OrderNotFoundException } from '../../../domain/order-aggregate/exceptions/order-not-found.exception';

@Injectable()
export class TypeOrmOrdersQueryRepository implements IOrdersQueryRepository {
  public constructor(
    @InjectRepository(OrderTypeOrm)
    private readonly repository: Repository<OrderTypeOrm>,
  ) {}

  public async findAll(): Promise<OrderReadModel[]> {
    const ordersTypeOrm: OrderTypeOrm[] = await this.repository.find({
      relations: {
        items: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return ordersTypeOrm.map((orderTypeOrm) =>
      OrdersMapper.toOrderReadModel(orderTypeOrm),
    );
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
    const orderTypeOrm: OrderTypeOrm | null = await this.repository.findOne({
      where: { id },
      relations: {
        items: true,
      },
    });

    if (!orderTypeOrm) {
      return null;
    }

    return OrdersMapper.toOrderReadModel(orderTypeOrm);
  }

  public async findOrderDetail(
    userId: string,
    orderId: string,
  ): Promise<OrderDetailReadModel> {
    const orderTypeOrm: OrderTypeOrm | null = await this.repository.findOne({
      where: { id: orderId, userId },
      relations: {
        user: true,
        items: {
          product: {
            covers: true,
          },
        },
      },
    });

    if (!orderTypeOrm) {
      throw new OrderNotFoundException();
    }

    return OrdersMapper.toOrderDetailReadModel(orderTypeOrm);
  }
}
