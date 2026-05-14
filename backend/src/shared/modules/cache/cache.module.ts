import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { CACHE_REPOSITORY } from './domain/cache.repository.interface';
import { RedisCacheRepository } from './infrastructure/redis-cache.repository';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (config: ConfigService) =>
        new Redis({
          host: config.get('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
        }),
      inject: [ConfigService],
    },
    {
      provide: CACHE_REPOSITORY,
      useClass: RedisCacheRepository,
    },
  ],
  exports: [CACHE_REPOSITORY],
})
export class SharedCacheModule {}
