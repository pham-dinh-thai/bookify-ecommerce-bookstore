import { Inject, Injectable } from '@nestjs/common';
import {
  type IOrdersCommandRepository,
  ORDERS_COMMAND_REPOSITORY,
} from '../../../../order/domain/order-aggregate/repositories/orders-command.repository.interface';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import { Order } from '../../../../order/domain/order-aggregate/order.aggregate';
import { IUpdateOrderStatusRequest } from './update-order-status.request';
import { OrderStatus } from '../../../../order/domain/order-aggregate/enums/order-status.enum';
import { OrderStatusCanNotBeUpdatedException } from '../../../../order/domain/order-aggregate/exceptions/order-status-can-not-be-updated.exception';

@Injectable()
export class UpdateOrderStatusUseCase {
  public constructor(
    @Inject(ORDERS_COMMAND_REPOSITORY)
    private readonly ordersCommandRepository: IOrdersCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(
    request: IUpdateOrderStatusRequest,
    id: string,
    performedBy: string,
  ): Promise<void> {
    const order: Order = await this.ordersCommandRepository.findOne(id);

    const update = this.getStatusHandler(order, request.status);

    update();

    await this.unitOfWork.execute(async () => {
      await this.ordersCommandRepository.save(order);

      await this.auditLogCommandRepository.write(
        'UPDATE_ORDER_STATUS',
        performedBy,
        'order-management',
        'orders',
        { order },
      );
    });
  }

  private getStatusHandler(order: Order, status: OrderStatus): () => void {
    const statusHandlers: Partial<Record<OrderStatus, () => void>> = {
      [OrderStatus.CONFIRMED]: () => order.confirm(),
      [OrderStatus.DELIVERING]: () => order.startDelivery(),
      [OrderStatus.DELIVERED]: () => order.markAsDelivered(),
      [OrderStatus.COMPLETED]: () => order.complete(),
    };

    const handler = statusHandlers[status];
    if (!handler) {
      throw new OrderStatusCanNotBeUpdatedException();
    }

    return handler;
  }
}
