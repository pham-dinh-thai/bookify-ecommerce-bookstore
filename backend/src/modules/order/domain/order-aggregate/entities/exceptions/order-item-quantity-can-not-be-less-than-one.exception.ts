import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class OrderItemQuantityCanNotBeLessThanOneException extends BadRequestDomainException {
  public constructor() {
    super(
      'Order item quantity can not be less than one',
      'ORDER_ITEM_QUANTITY_INVALID',
    );
  }
}
