import type { WishlistItem } from './entities/wishlist-item.entity';

export type CreateWishlistProps = {
  id: string;
  userId: string;
};

export type FromPersistentWishlistProps = {
  id: string;
  userId: string;
  items: WishlistItem[];
};

export type CreateWishlistItemProps = {
  id: string;
  itemId: string;
};

export type FromPersistentWishlistItemProps = {
  id: string;
  itemId: string;
};
