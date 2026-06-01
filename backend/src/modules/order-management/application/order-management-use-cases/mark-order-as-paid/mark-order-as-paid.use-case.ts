import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import { Order } from '../../../../order/domain/order-aggregate/order.aggregate';
import {
  ORDERS_COMMAND_REPOSITORY,
  type IOrdersCommandRepository,
} from '../../../../order/domain/order-aggregate/repositories/orders-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import { PaymentStatus } from '../../../../order/domain/order-aggregate/enums/payment-status.enum';

@Injectable()
export class MarkOrderAsPaidUseCase {
  public constructor(
    @Inject(ORDERS_COMMAND_REPOSITORY)
    private readonly ordersCommandRepository: IOrdersCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(id: string, performedBy: string): Promise<void> {
    const order: Order = await this.ordersCommandRepository.findOne(id);

    if (order.getPaymentStatus() === PaymentStatus.PAID) {
      return;
    }

    if (order.getPaymentStatus() === PaymentStatus.REFUNDED) {
      throw new BadRequestException('Refunded orders cannot be marked as paid');
    }

    order.markAsPaid();

    await this.unitOfWork.execute(async () => {
      await this.ordersCommandRepository.save(order);

      await this.auditLogCommandRepository.write(
        'MARK_ORDER_AS_PAID',
        performedBy,
        'order-management',
        'orders',
        { order },
      );
    });
  }
}
