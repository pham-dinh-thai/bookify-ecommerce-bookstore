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
import { OrderNotFoundException } from '../../../domain/order-aggregate/exceptions/order-not-found.exception';
import { Book } from '../../../../book-management/domain/book-aggregate/book.aggregate';
import {
  BOOKS_COMMAND_REPOSITORY,
  type IBooksCommandRepository,
} from '../../../../book-management/domain/book-aggregate/repositories/books-command.repository.interface';

/**
 * Cancels a customer-owned order.
 *
 * Business logic: Customers can only cancel their own orders while the order
 * remains in a cancellable lifecycle state. Because stock is reserved when an
 * order is placed, cancellation returns each ordered quantity to book inventory
 * in the same transaction that marks the order as canceled.
 *
 * Every cancellation is recorded in the audit log for traceability.
 */
@Injectable()
export class CancelOrderUseCase {
  public constructor(
    @Inject(ORDERS_COMMAND_REPOSITORY)
    private readonly ordersCommandRepository: IOrdersCommandRepository,

    @Inject(BOOKS_COMMAND_REPOSITORY)
    private readonly bookCommandRepository: IBooksCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(id: string, performedBy: string): Promise<void> {
    const order: Order = await this.ordersCommandRepository.findOne(id);

    if (order.getUserId() !== performedBy) {
      throw new OrderNotFoundException();
    }

    order.cancel();

    await this.unitOfWork.execute(async () => {
      await this.ordersCommandRepository.save(order);

      for (const item of order.getItems()) {
        const book: Book = await this.bookCommandRepository.findOne(
          item.getProductId(),
        );

        book.increaseQuantity(item.getQuantity());

        await this.bookCommandRepository.save(book);
      }

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
