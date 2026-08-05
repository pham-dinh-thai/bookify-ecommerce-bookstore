import { WishlistItem } from '../entities/wishlist-item.entity';
import { Wishlist } from '../wishlist.aggregate';

export interface IWishlistsCommandRepository {
  findUserWishlist(userId: string): Promise<Wishlist | null>;

  create(wishlist: Wishlist): Promise<void>;

  addItemToWishlist(
    wishlistId: string,
    wishlistItem: WishlistItem,
  ): Promise<void>;
}

export const WISHLISTS_COMMAND_REPOSITORY = 'IWishlistsCommandRepository';
