import { WishlistReadModel } from '../read-models/wishlist.read-model';

export interface IWishlistsQueryRepository {
  findUserWishlist(userId: string): Promise<WishlistReadModel | null>;
}

export const WISHLISTS_QUERY_REPOSITORY = 'IWishlistsQueryRepository';
