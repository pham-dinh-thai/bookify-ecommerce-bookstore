import { NotFoundDomainException } from '../../../../shared/domain/exception/domain.exception';

export class WishlistItemNotFoundException extends NotFoundDomainException {
  public constructor() {
    super('Wishlist item not found', 'WISHLIST_ITEM_NOT_FOUND');
  }
}
