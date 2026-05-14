export const CACHE_REPOSITORY = 'CACHE_REPOSITORY';

export interface ICacheRepository {
  get<T>(key: string): Promise<T | null>;

  set<T>(key: string, value: T, ttl?: number): Promise<void>;

  del(key: string): Promise<void>;

  delByPattern(pattern: string): Promise<void>;
}
