import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class OrderItemIdEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Order item id is required', 'ORDER_ITEM_ID_EMPTY');
  }
}
