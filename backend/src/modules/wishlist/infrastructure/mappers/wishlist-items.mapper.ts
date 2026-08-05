import { WishlistItem } from '../../domain/entities/wishlist-item.entity';
import { WishlistItemTypeOrm } from '../entities/wishlist-item.entity';

export class WishlistItemsMapper {
  public static toTypeOrm(
    wishlistId,
    wishlistItem: WishlistItem,
  ): WishlistItemTypeOrm {
    const wishlistItemTypeOrm = new WishlistItemTypeOrm();

    wishlistItemTypeOrm.id = wishlistItem.getId();
    wishlistItemTypeOrm.wishlistId = wishlistId;
    wishlistItemTypeOrm.itemId = wishlistItem.getItemId();

    return wishlistItemTypeOrm;
  }
}
