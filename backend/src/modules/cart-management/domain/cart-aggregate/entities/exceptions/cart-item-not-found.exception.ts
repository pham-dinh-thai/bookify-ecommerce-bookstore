import { NotFoundDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class CartItemNotFoundException extends NotFoundDomainException {
  public constructor() {
    super('Cart item not found', 'CART_ITEM_NOT_FOUND');
  }
}
