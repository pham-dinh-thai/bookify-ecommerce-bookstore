import { Inject, Injectable } from '@nestjs/common';
import {
  type IOrdersCommandRepository,
  ORDERS_COMMAND_REPOSITORY,
} from '../../../domain/order-aggregate/repositories/orders-command.repository.interface';
import { Order } from '../../../domain/order-aggregate/order.aggregate';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';

@Injectable()
export class CancelOrderUseCase {
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

    order.cancel();

    await this.unitOfWork.execute(async () => {
      await this.ordersCommandRepository.save(order);

      await this.auditLogCommandRepository.write(
        'CANCEL_ORDER',
        performedBy,
        'order',
        'orders',
        {
          order,
        },
      );
    });
  }
}
