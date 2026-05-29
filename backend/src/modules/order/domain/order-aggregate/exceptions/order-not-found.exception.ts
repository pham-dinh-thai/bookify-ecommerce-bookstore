import { NotFoundDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class OrderNotFoundException extends NotFoundDomainException {
  public constructor() {
    super('Order is not found', 'ORDER_NOT_FOUND');
  }
}
