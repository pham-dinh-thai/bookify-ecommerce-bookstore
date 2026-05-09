export const GENRE_CACHE_KEYS = {
  ALL: 'genres:all',
  PAGE: (page: number, limit: number, search?: string) =>
    `genres:page=${page}:limit=${limit}:search=${search ?? ''}`,
} as const;

export const GENRE_CACHE_TTL = {
  ALL: 60 * 60 * 24 * 1000,
} as const;
