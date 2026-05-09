export const AUTHOR_CACHE_KEYS = {
  ALL: 'authors:all',
  PAGE: (page: number, limit: number, search?: string) =>
    `authors:page=${page}:limit=${limit}:search=${search ?? ''}`,
} as const;

export const AUTHOR_CACHE_TTL = {
  ALL: 60 * 60 * 24 * 1000,
} as const;
