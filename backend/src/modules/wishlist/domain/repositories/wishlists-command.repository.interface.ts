import { WishlistItem } from '../entities/wishlist-item.entity';
import { Wishlist } from '../wishlist.aggregate';

export interface IWishlistsCommandRepository {
  findUserWishlist(userId: string): Promise<Wishlist | null>;

  findUserWishlistOrThrows(userId: string): Promise<Wishlist>;

  create(wishlist: Wishlist): Promise<void>;

  addItemToWishlist(
    wishlistId: string,
    wishlistItem: WishlistItem,
  ): Promise<void>;

  removeItemFromWishlist(wishlistId: string, itemId: string): Promise<void>;
}

export const WISHLISTS_COMMAND_REPOSITORY = 'IWishlistsCommandRepository';
