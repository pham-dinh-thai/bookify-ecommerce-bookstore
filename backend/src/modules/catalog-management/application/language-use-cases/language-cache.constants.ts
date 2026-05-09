export const LANGUAGE_CACHE_KEYS = {
  ALL: 'languages:all',
  PAGE: (page: number, limit: number, search?: string) =>
    `languages:page=${page}:limit=${limit}:search=${search ?? ''}`,
} as const;

export const LANGUAGE_CACHE_TTL = {
  ALL: 60 * 60 * 24 * 1000,
} as const;
