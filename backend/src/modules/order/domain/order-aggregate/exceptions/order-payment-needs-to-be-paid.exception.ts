import { UnprocessableEntityDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class OrderPaymentNeedsToBePaidException extends UnprocessableEntityDomainException {
  public constructor() {
    super(
      'Order payment needs to be paid before completion',
      'ORDER_PAYMENT_NEEDS_TO_BE_PAID_BEFORE_COMPLETION',
    );
  }
}
