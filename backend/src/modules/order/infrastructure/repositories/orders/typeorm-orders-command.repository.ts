import { Injectable } from '@nestjs/common';
import { IOrdersCommandRepository } from '../../../domain/order-aggregate/repositories/orders-command.repository.interface';
import { Order } from '../../../domain/order-aggregate/order.aggregate';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { OrderTypeOrm } from '../../entities/order.entity';
import { OrderItemTypeOrm } from '../../entities/order-item.entity';
import { OrdersMapper } from '../../mappers/orders.mapper';
import { OrderItemsMapper } from '../../mappers/order-items.mapper';
import { OrderNotFoundException } from '../../../domain/order-aggregate/exceptions/order-not-found.exception';

@Injectable()
export class TypeOrmOrdersCommandRepository implements IOrdersCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findOne(id: string): Promise<Order> {
    const orderTypeOrm: OrderTypeOrm | null = await this.unitOfWork
      .getManager()
      .findOne(OrderTypeOrm, { where: { id }, relations: { items: true } });

    if (!orderTypeOrm) {
      throw new OrderNotFoundException();
    }

    return OrdersMapper.toDomain(orderTypeOrm);
  }

  /**
   * Stores the order root first, then stores each order item with the created
   * order ID so the whole aggregate is persisted in the current unit of work.
   */
  public async insert(order: Order): Promise<void> {
    const orderTypeOrm = OrdersMapper.toTypeOrm(order);

    await this.unitOfWork.getManager().insert(OrderTypeOrm, orderTypeOrm);

    for (const item of order.getItems()) {
      await this.unitOfWork
        .getManager()
        .insert(
          OrderItemTypeOrm,
          OrderItemsMapper.toTypeOrm(orderTypeOrm.id, item),
        );
    }
  }

  public async save(order: Order): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(OrderTypeOrm, OrdersMapper.toTypeOrm(order));
  }
}
