import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class CartItemLimitExceededException extends BadRequestDomainException {
  public constructor() {
    super('Cart item limit exceeded', 'CART_ITEM_LIMIT_EXCEEDED');
  }
}
