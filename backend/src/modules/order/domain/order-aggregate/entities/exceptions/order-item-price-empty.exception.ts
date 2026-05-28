import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class OrderItemPriceEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Order item price is required', 'ORDER_ITEM_PRICE_EMPTY');
  }
}
