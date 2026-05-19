import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class CartItemDuplicatedException extends BadRequestDomainException {
  public constructor() {
    super('Cart item duplicated', 'CART_ITEM_DUPLICATED');
  }
}
