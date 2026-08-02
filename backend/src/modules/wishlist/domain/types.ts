export type CreateWishlistProps = {
  id: string;
  userId: string;
};

export type FromPersistentWishlistProps = {
  id: string;
  userId: string;
  items: any;
};

export type CreateWishlistItemProps = {
  id: string;
  itemId: string;
};

export type FromPersistentWishlistItemProps = {
  id: string;
  itemId: string;
};
