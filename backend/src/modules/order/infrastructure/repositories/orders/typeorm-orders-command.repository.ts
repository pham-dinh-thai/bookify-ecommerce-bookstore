import { Injectable } from '@nestjs/common';
import { IOrdersCommandRepository } from '../../../domain/order-aggregate/repositories/orders-command.repository.interface';
import { Order } from '../../../domain/order-aggregate/order.aggregate';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { OrderTypeOrm } from '../../entities/order.entity';
import { OrderItemTypeOrm } from '../../entities/order-item.entity';
import { OrdersMapper } from '../../mappers/orders.mapper';
import { OrderItemsMapper } from '../../mappers/order-items.mapper';

@Injectable()
export class TypeOrmOrdersCommandRepository implements IOrdersCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

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
}
