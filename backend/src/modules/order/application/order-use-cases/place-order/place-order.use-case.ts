import { Inject, Injectable } from '@nestjs/common';
import { IPlaceOrderRequest } from './place-order.request';
import { Order } from '../../../domain/order-aggregate/order.aggregate';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';
import {
  CUSTOMERS_QUERY_REPOSITORY,
  type ICustomersQueryRepository,
} from '../../../../customer-management/domain/customer-aggregate/repositories/customers-query.repository.interface';
import { CustomerReadModel } from '../../../../customer-management/domain/customer-aggregate/read-models/customer.read-model';
import { CustomerNotFoundException } from '../../../../customer-management/domain/customer-aggregate/exceptions/customer-not-found.exception';
import { PhoneNumberEmptyException } from '../../../domain/order-aggregate/entities/exceptions/phone-number-empty.exception';
import { ShippingAddressEmptyException } from '../../../domain/order-aggregate/entities/exceptions/shipping-address-empty.exception';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  type IOrdersCommandRepository,
  ORDERS_COMMAND_REPOSITORY,
} from '../../../domain/order-aggregate/repositories/orders-command.repository.interface';
import { BookNotFoundException } from '../../../../book-management/domain/book-aggregate/exceptions/book-not-found.exception';
import {
  BOOKS_COMMAND_REPOSITORY,
  type IBooksCommandRepository,
} from '../../../../book-management/domain/book-aggregate/repositories/books-command.repository.interface';
import { Book } from '../../../../book-management/domain/book-aggregate/book.aggregate';
import { InsufficientStockException } from '../../../domain/order-aggregate/exceptions/insufficient-stock.exception';

/**
 * Places a new customer order.
 *
 * Business logic: The customer must have enough fulfillment information before
 * checkout. The order captures delivery details and item prices as immutable
 * purchase snapshots, then reserves inventory by decreasing each book quantity
 * in the same transaction that creates the order.
 *
 * The placement is rejected when any ordered book does not have enough stock,
 * and every successful placement is recorded in the audit log for traceability.
 */
@Injectable()
export class PlaceOrderUseCase {
  public constructor(
    @Inject(ORDERS_COMMAND_REPOSITORY)
    private readonly ordersCommandRepository: IOrdersCommandRepository,

    @Inject(CUSTOMERS_QUERY_REPOSITORY)
    private readonly customersQueryRepository: ICustomersQueryRepository,

    @Inject(BOOKS_COMMAND_REPOSITORY)
    private readonly booksCommandRepository: IBooksCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  public async execute(
    request: IPlaceOrderRequest,
    userId: string,
  ): Promise<void> {
    const customer: CustomerReadModel | null =
      await this.customersQueryRepository.findByUserId(userId);

    if (!customer) {
      throw new CustomerNotFoundException();
    }

    const phoneNumber = request.phoneNumber?.trim() || customer.phoneNumber;
    if (!phoneNumber) {
      throw new PhoneNumberEmptyException();
    }

    const defaultAddress = customer.addresses.find(
      (address) => address.isDefault === true,
    );
    const shippingAddress =
      request.shippingAddress?.trim() ||
      (defaultAddress
        ? `${defaultAddress.street}, ${defaultAddress.wardName}, ${defaultAddress.provinceName}`
        : '');

    if (!shippingAddress) {
      throw new ShippingAddressEmptyException();
    }

    const orderId = this.uuidGenerator.generate();
    const order: Order = Order.create({
      id: orderId,
      orderCode: this.generateOrderCode(orderId),
      userId: userId,
      paymentMethod: request.paymentMethod,
      shippingAddress: shippingAddress,
      phoneNumber: phoneNumber,
    });

    await this.unitOfWork.execute(async () => {
      for (const item of request.items) {
        const book: Book = await this.booksCommandRepository.findOne(
          item.productId,
        );

        if (!book) {
          throw new BookNotFoundException();
        }

        if (book.getQuantity() < item.quantity) {
          throw new InsufficientStockException(
            item.productId,
            item.quantity,
            book.getQuantity(),
          );
        }

        order.addItem({
          id: this.uuidGenerator.generate(),
          productId: item.productId,
          quantity: item.quantity,
          price: book.getCurrentPrice(),
        });

        book.decreaseQuantity(item.quantity);

        await this.booksCommandRepository.save(book);
      }

      await this.ordersCommandRepository.insert(order);

      await this.auditLogCommandRepository.write(
        'PLACE_ORDER',
        userId,
        'order',
        'orders',
        {
          order,
        },
      );
    });
  }

  private generateOrderCode(orderId: string): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const readableDate = `${year}${month}${day}`;
    const suffix = orderId.replace(/-/g, '').slice(-12).toUpperCase();

    return `BKF-${readableDate}-${suffix}`;
  }
}
