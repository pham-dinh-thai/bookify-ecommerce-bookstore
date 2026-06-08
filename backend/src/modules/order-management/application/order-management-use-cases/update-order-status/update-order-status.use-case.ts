import { Inject, Injectable } from '@nestjs/common';
import {
  EVENT_DISPATCHER,
  type IEventDispatcher,
} from '../../../../../shared/domain/event-dispatcher.interface';
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
import {
  CUSTOMERS_QUERY_REPOSITORY,
  type ICustomersQueryRepository,
} from '../../../../customer-management/domain/customer-aggregate/repositories/customers-query.repository.interface';

@Injectable()
export class UpdateOrderStatusUseCase {
  public constructor(
    @Inject(ORDERS_COMMAND_REPOSITORY)
    private readonly ordersCommandRepository: IOrdersCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(CUSTOMERS_QUERY_REPOSITORY)
    private readonly customersQueryRepository: ICustomersQueryRepository,

    @Inject(EVENT_DISPATCHER)
    private readonly eventDispatcher: IEventDispatcher,
  ) {}

  public async execute(
    request: IUpdateOrderStatusRequest,
    id: string,
    performedBy: string,
  ): Promise<void> {
    const order: Order = await this.ordersCommandRepository.findOne(id);
    const customer = await this.customersQueryRepository.findByUserId(
      order.getUserId(),
    );

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

    if (customer) {
      this.recordStatusEvent(order, request.status, {
        email: customer.email,
        name: `${customer.firstName} ${customer.lastName}`.trim(),
      });
      await this.eventDispatcher.dispatch(order.getDomainEvents());
      order.clearDomainEvents();
    }
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

  private recordStatusEvent(
    order: Order,
    status: OrderStatus,
    customer: { email: string; name: string },
  ): void {
    const eventProps = {
      customerEmail: customer.email,
      customerName: customer.name,
    };

    const recorders: Record<OrderStatus, () => void> = {
      [OrderStatus.PENDING]: () => {
        throw new OrderStatusCanNotBeUpdatedException();
      },
      [OrderStatus.CONFIRMED]: () => order.recordConfirmed(eventProps),
      [OrderStatus.DELIVERING]: () => order.recordDeliveryStarted(eventProps),
      [OrderStatus.DELIVERED]: () => order.recordDelivered(eventProps),
      [OrderStatus.COMPLETED]: () => order.recordCompleted(eventProps),
      [OrderStatus.CANCELED]: () => {
        throw new OrderStatusCanNotBeUpdatedException();
      },
      [OrderStatus.REFUNDED]: () => {
        throw new OrderStatusCanNotBeUpdatedException();
      },
    };

    recorders[status]();
  }
}
