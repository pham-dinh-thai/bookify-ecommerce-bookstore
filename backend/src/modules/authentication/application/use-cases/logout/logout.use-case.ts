import { Inject, Injectable } from '@nestjs/common';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/cache/domain/cache.repository.interface';

@Injectable()
export class LogoutUseCase {
  public constructor(
    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,
  ) {}

  public async execute(
    userId: string,
    jti: string,
    exp: number,
  ): Promise<void> {
    await this.cache.del(`refresh_token:${userId}`);

    const now = Math.floor(Date.now() / 1000);
    const ttl = Math.max(exp - now, 1) * 1000;

    await this.cache.set(`blacklist_access_token:${jti}`, true, ttl);
  }
}
