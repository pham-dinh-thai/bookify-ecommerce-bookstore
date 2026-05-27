import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class OrderItemPriceCanNotNegativeException extends BadRequestDomainException {
  public constructor() {
    super('Order item price can not be negative', 'ORDER_ITEM_NEGATIVE');
  }
}
