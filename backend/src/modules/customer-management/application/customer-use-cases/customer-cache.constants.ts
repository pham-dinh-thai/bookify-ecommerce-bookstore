import { CustomerFilter } from '../../domain/customer-aggregate/customer.filter';

export const CUSTOMER_CACHE_KEYS = {
  ALL: 'customers:all',
  PAGE: (
    page: number,
    limit: number,
    filter?: CustomerFilter,
    search?: string,
  ) =>
    `customers:page=${page}:limit=${limit}:isActive=${filter?.isActive ?? ''}:search=${search ?? ''}`,
} as const;

export const CUSTOMER_CACHE_TTL = {
  ALL: 60 * 60 * 1000,
} as const;
