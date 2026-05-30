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
import {
  BOOKS_QUERY_REPOSITORY,
  type IBooksQueryRepository,
} from '../../../../book-management/domain/book-aggregate/repositories/books-query.repository.interface';
import { BookReadModel } from '../../../../book-management/domain/book-aggregate/read-models/book.read-model';
import { BookNotFoundException } from '../../../../book-management/domain/book-aggregate/exceptions/book-not-found.exception';

/**
 * Places an order only when the customer profile has enough fulfillment data.
 *
 * The order captures the customer's current default address and phone number
 * as a delivery snapshot so later profile changes do not mutate the order.
 */
@Injectable()
export class PlaceOrderUseCase {
  public constructor(
    @Inject(ORDERS_COMMAND_REPOSITORY)
    private readonly ordersCommandRepository: IOrdersCommandRepository,

    @Inject(CUSTOMERS_QUERY_REPOSITORY)
    private readonly customersQueryRepository: ICustomersQueryRepository,

    @Inject(BOOKS_QUERY_REPOSITORY)
    private readonly booksQueryRepository: IBooksQueryRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  /**
   * Requires a known customer, a phone number, and a default shipping address
   * before accepting payment intent or reserving order items.
   */
  public async execute(
    request: IPlaceOrderRequest,
    userId: string,
  ): Promise<void> {
    const customer: CustomerReadModel | null =
      await this.customersQueryRepository.findByUserId(userId);

    if (!customer) {
      throw new CustomerNotFoundException();
    }

    if (!customer.phoneNumber) {
      throw new PhoneNumberEmptyException();
    }

    const defaultAddress = customer.addresses.find(
      (address) => address.isDefault === true,
    );
    if (!defaultAddress) {
      throw new ShippingAddressEmptyException();
    }
    const shippingAddress = `${defaultAddress.street}, ${defaultAddress.wardName}, ${defaultAddress.provinceName}`;

    const order: Order = Order.create({
      id: this.uuidGenerator.generate(),
      userId: userId,
      paymentMethod: request.paymentMethod,
      shippingAddress: shippingAddress,
      phoneNumber: customer.phoneNumber,
    });

    for (const item of request.items) {
      const book: BookReadModel | null = await this.booksQueryRepository.findOne(
        item.productId,
      );

      if (!book) {
        throw new BookNotFoundException();
      }

      order.addItem({
        id: this.uuidGenerator.generate(),
        productId: item.productId,
        quantity: item.quantity,
        price: book.originalPrice,
      });
    }

    await this.unitOfWork.execute(async () => {
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
}
