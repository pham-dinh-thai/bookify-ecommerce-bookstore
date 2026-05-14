import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';
import { ICacheRepository } from '../domain/cache.repository.interface';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheRepository implements ICacheRepository {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,

    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    return (await this.cache.get<T>(key)) ?? null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cache.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async delByPattern(pattern: string): Promise<void> {
    const keys = await this.redisClient.keys(`keyv::keyv:${pattern}`);
    console.log('Keys found:', keys);
    if (keys.length > 0) {
      await this.redisClient.del(...keys);
    }
  }
}
