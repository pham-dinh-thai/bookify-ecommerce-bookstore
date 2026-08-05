import { WishlistItemReadModel } from '../../domain/read-models/wishlist-item.read-model';
import { WishlistReadModel } from '../../domain/read-models/wishlist.read-model';
import { Wishlist } from '../../domain/wishlist.aggregate';
import { WishlistTypeOrm } from '../entities/wishlist.entity';

export class WishlistsMapper {
  public static toTypeOrm(wishlist: Wishlist): WishlistTypeOrm {
    const wishlistTypeOrm = new WishlistTypeOrm();

    wishlistTypeOrm.id = wishlist.getId();
    wishlistTypeOrm.userId = wishlist.getUserId();

    return wishlistTypeOrm;
  }

  public static toReadModel(
    wishlistTypeOrm: WishlistTypeOrm,
  ): WishlistReadModel {
    return new WishlistReadModel(
      wishlistTypeOrm.id,
      wishlistTypeOrm.userId,
      (wishlistTypeOrm.wishlistItems ?? []).map((itemTypeOrm) => {
        const book = itemTypeOrm.book;
        const covers = book?.covers ?? [];
        const primaryCover =
          covers.find((cover) => cover.isPrimary) ?? covers[0];
        const authorNames =
          book?.bookAuthors
            ?.map((bookAuthor) => bookAuthor.author?.name)
            .filter(Boolean)
            .join(', ') ?? '';
        const originalPrice = Number(book?.originalPrice ?? 0);
        const discountPercentage = Number(book?.discountPercentage ?? 0);
        const currentPrice = Math.max(
          0,
          originalPrice * (1 - discountPercentage / 100),
        );
        const genreIds =
          book?.bookGenres
            ?.map((bookGenre) => bookGenre.genre?.id)
            .filter(Boolean) ?? [];

        return new WishlistItemReadModel(
          itemTypeOrm.id,
          itemTypeOrm.itemId,
          book?.title ?? '',
          authorNames,
          primaryCover?.url ?? '',
          originalPrice,
          currentPrice,
          discountPercentage,
          (book?.quantity ?? 0) > 0,
          genreIds,
        );
      }),
    );
  }
}
