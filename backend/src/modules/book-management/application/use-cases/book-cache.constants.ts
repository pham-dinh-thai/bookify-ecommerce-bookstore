export const BOOK_CACHE_KEYS = {
  ALL: 'books:all',
  PAGE: (page: number, limit: number, search?: string) =>
    `books:page=${page}:limit=${limit}:search=${search ?? ''}`,
} as const;

export const BOOK_CACHE_TTL = {
  ALL: 60 * 60 * 1000,
} as const;
