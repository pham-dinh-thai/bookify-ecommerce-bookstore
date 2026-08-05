import { BadRequestDomainException } from '../../../../shared/domain/exception/domain.exception';

export class WishlistMaxItemsReachedException extends BadRequestDomainException {
  public constructor() {
    super('Wishlist can hold at most 50 items', 'WISHLIST_MAX_ITEMS_REACHED');
  }
}
