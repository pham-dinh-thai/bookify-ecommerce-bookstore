export const AUDIT_LOG_CACHE_KEYS = {
  ALL: 'audit-logs:all',
  PAGE: (page: number, limit: number, search?: string) =>
    `audit-logs:page=${page}:limit=${limit}:search=${search ?? ''}`,
} as const;

export const AUDIT_LOG_CACHE_TTL = {
  ALL: 60 * 60 * 1000,
} as const;
