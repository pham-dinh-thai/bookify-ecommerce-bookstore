import { WishlistReadModel } from '../read-models/wishlist.read-model';

export interface IWishlistsQueryRepository {
  findUserWishlist(userId: string): Promise<WishlistReadModel | null>;

  findUserWishlistOrThrows(userId: string): Promise<WishlistReadModel>;
}

export const WISHLISTS_QUERY_REPOSITORY = 'IWishlistsQueryRepository';
