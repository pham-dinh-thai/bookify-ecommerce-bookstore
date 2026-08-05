export const WISHLIST_CACHE_KEYS = {
  USER: (userId: string) => `wishlists:user=${userId}`,
} as const;

export const WISHLIST_CACHE_TTL = {
  USER: 60 * 60 * 1000,
} as const;
