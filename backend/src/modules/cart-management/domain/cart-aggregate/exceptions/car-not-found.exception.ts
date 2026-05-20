import { NotFoundDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class CartNotFoundException extends NotFoundDomainException {
  public constructor() {
    super('Cart not found', 'CART_NOT_FOUND');
  }
}
