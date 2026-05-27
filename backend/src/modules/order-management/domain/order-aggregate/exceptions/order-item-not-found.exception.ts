import { NotFoundDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class OrderItemNotFoundException extends NotFoundDomainException {
  public constructor() {
    super('Order item not found', 'ORDER_ITEM_NOT_FOUND');
  }
}
