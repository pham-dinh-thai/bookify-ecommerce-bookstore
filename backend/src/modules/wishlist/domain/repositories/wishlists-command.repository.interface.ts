import { Wishlist } from '../wishlist.aggregate';

export interface IWishlistsCommandRepository {
  findUserWishlistOrThrows(userId: string): Promise<Wishlist>;

  create(): Promise<any>;

  remove(): Promise<any>;

  addItemToWishlist(): Promise<any>;
}

export const WISHLISTS_COMMAND_REPOSITORY = 'IWishlistsCommandRepository';
