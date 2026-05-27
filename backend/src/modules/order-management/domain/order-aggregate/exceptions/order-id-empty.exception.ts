import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class OrderIdEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Order id is required', 'ORDER_ID_EMPTY');
  }
}
