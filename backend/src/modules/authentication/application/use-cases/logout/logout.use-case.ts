import { Inject, Injectable } from '@nestjs/common';
import { ILogoutRequest } from './logout.request';
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

  public async execute(request: ILogoutRequest): Promise<void> {
    await this.cache.del(`refresh_token:${request.userId}`);

    const now = Math.floor(Date.now() / 1000);
    const ttl = Math.max(request.exp - now, 0);

    await this.cache.set(`blacklist_access_token:${request.jti}`, true, ttl);
  }
}
