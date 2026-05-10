import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersQueryRepository,
  USERS_QUERY_REPOSITORY,
} from '../../../domain/user-aggregate/repositories/users-query.repository.interface';
import { FindUsersResponse } from './find-users.response';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/cache/domain/cache.repository.interface';
import { UserFilter } from '../../../domain/user-aggregate/user-filter';
import { USER_CACHE_KEYS, USER_CACHE_TTL } from '../user-cache.constants';

@Injectable()
export class FindUsersUseCase {
  public constructor(
    @Inject(USERS_QUERY_REPOSITORY)
    private readonly repository: IUsersQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,
  ) {}

  public async execute(
    page: number,
    limit: number,
    filter?: UserFilter,
    search?: string,
  ): Promise<FindUsersResponse> {
    const cacheKey = USER_CACHE_KEYS.PAGE(page, limit, filter, search);

    const cached = await this.cache.get<FindUsersResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const users = await this.repository.findAll(page, limit, filter, search);
    const total = await this.repository.count(filter, search);

    const response = new FindUsersResponse(users, total);

    await this.cache.set(cacheKey, response, USER_CACHE_TTL.ALL);

    return response;
  }
}
