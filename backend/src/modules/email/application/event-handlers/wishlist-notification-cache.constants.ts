export const WISHLIST_NOTIFICATION_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

export const WISHLIST_NOTIFICATION_CACHE_KEYS = {
  PRICE_DROP: (bookId: string, userId: string) =>
    `wishlist-notifications:price-drop:${bookId}:${userId}`,
  RESTOCK: (bookId: string, userId: string) =>
    `wishlist-notifications:restock:${bookId}:${userId}`,
} as const;
