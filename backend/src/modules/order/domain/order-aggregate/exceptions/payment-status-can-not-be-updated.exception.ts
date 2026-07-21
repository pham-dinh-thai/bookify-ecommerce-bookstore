import { UnprocessableEntityDomainException } from '../../../../../shared/domain/exception/domain.exception';
import { PaymentStatus } from '../enums/payment-status.enum';

export class PaymentStatusCanNotBeUpdatedException extends UnprocessableEntityDomainException {
  public constructor(
    message: string = 'Can not update payment status',
    code: string = 'PAYMENT_STATUS_CAN_NOT_BE_UPDATED',
  ) {
    super(message, code);
  }

  public static needToBe(
    ...expectedStatuses: PaymentStatus[]
  ): PaymentStatusCanNotBeUpdatedException {
    const expectedText = expectedStatuses
      .map((status) => PaymentStatusCanNotBeUpdatedException.toReadable(status))
      .join(' or ');

    const expectedCode = expectedStatuses
      .map((status) => status.toUpperCase())
      .join('_OR_');

    return new PaymentStatusCanNotBeUpdatedException(
      `Payment needs to be ${expectedText} first`,
      `PAYMENT_NEEDS_TO_BE_${expectedCode}_FIRST`,
    );
  }

  private static toReadable(status: PaymentStatus): string {
    const readableStatuses: Record<PaymentStatus, string> = {
      [PaymentStatus.UNPAID]: 'unpaid',
      [PaymentStatus.PENDING]: 'pending',
      [PaymentStatus.PAID]: 'paid',
      [PaymentStatus.REFUNDED]: 'refunded',
    };

    return readableStatuses[status];
  }
}
