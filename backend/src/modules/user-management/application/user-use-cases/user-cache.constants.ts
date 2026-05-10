import { UserFilter } from '../../domain/user-aggregate/user-filter';

export const USER_CACHE_KEYS = {
  ALL: 'users:all',
  PAGE: (page: number, limit: number, filter?: UserFilter, search?: string) =>
    `users:page=${page}:limit=${limit}:roleId=${filter?.roleId ?? ''}:excludeRoleId=${filter?.excludeRoleId ?? ''}:isActive=${filter?.isActive ?? ''}:search=${search ?? ''}`,
} as const;

export const USER_CACHE_TTL = {
  ALL: 60 * 60 * 1000,
} as const;
