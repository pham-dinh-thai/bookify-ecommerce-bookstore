import { UnprocessableEntityDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class OrderStatusCanNotBeUpdatedException extends UnprocessableEntityDomainException {
  public constructor() {
    super('Can not update order status', 'ORDER_STATUS_CAN_NOT_BE_UPDATED');
  }
}
