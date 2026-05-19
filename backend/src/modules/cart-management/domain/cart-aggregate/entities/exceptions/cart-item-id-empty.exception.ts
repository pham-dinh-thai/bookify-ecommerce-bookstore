import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class CartItemIdEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Cart item id is required', 'CART_ITEM_ID_EMPTY');
  }
}
