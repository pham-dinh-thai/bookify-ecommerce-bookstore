import { WishlistReadModel } from '../read-models/wishlist.read-model';
import { WishlistUserReadModel } from '../read-models/wishlist-user.read-model';

export interface IWishlistsQueryRepository {
  findUserWishlist(userId: string): Promise<WishlistReadModel | null>;

  findWishlistUsersByBookId(bookId: string): Promise<WishlistUserReadModel[]>;
}

export const WISHLISTS_QUERY_REPOSITORY = 'IWishlistsQueryRepository';
