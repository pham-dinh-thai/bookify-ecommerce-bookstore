import { NotFoundDomainException } from '../../../../shared/domain/exception/domain.exception';

export class WishlistNotFoundException extends NotFoundDomainException {
  public constructor() {
    super('Wishlist not found', 'WISHLIST_NOT_FOUND');
  }
}
