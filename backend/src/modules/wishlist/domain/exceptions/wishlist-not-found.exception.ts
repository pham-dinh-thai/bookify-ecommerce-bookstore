import { BadRequestDomainException } from '../../../../shared/domain/exception/domain.exception';

export class WishlistNotFoundException extends BadRequestDomainException {
  public constructor() {
    super('Wishlist not found', 'WISHLIST_NOT_FOUND');
  }
}
