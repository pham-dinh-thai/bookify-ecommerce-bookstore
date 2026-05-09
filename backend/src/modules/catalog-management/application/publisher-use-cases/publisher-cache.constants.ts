export const PUBLISHER_CACHE_KEYS = {
  ALL: 'publishers:all',
  PAGE: (page: number, limit: number, search?: string) =>
    `publishers:page=${page}:limit=${limit}:search=${search ?? ''}`,
} as const;

export const PUBLISHER_CACHE_TTL = {
  ALL: 60 * 60 * 24 * 1000,
} as const;
