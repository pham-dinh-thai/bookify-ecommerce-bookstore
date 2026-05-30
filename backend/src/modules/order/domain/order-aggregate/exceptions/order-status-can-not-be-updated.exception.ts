import { UnprocessableEntityDomainException } from '../../../../../shared/domain/exception/domain.exception';
import { OrderStatus } from '../enums/order-status.enum';

export class OrderStatusCanNotBeUpdatedException extends UnprocessableEntityDomainException {
  public constructor(
    message: string = 'Can not update order status',
    code: string = 'ORDER_STATUS_CAN_NOT_BE_UPDATED',
  ) {
    super(message, code);
  }

  public static needToBe(
    ...expectedStatuses: OrderStatus[]
  ): OrderStatusCanNotBeUpdatedException {
    const expectedText = expectedStatuses
      .map((status) => OrderStatusCanNotBeUpdatedException.toReadable(status))
      .join(' or ');

    const expectedCode = expectedStatuses
      .map((status) => status.toUpperCase())
      .join('_OR_');

    return new OrderStatusCanNotBeUpdatedException(
      `Order needs to be ${expectedText} first`,
      `ORDER_NEEDS_TO_BE_${expectedCode}_FIRST`,
    );
  }

  private static toReadable(status: OrderStatus): string {
    const readableStatuses: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'pending',
      [OrderStatus.CONFIRMED]: 'confirmed',
      [OrderStatus.DELIVERING]: 'delivering',
      [OrderStatus.DELIVERED]: 'delivered',
      [OrderStatus.COMPLETED]: 'completed',
      [OrderStatus.CANCELED]: 'canceled',
      [OrderStatus.REFUNDED]: 'refunded',
    };

    return readableStatuses[status];
  }
}
