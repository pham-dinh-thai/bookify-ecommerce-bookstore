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

@Injectable()
export class FindUsersUseCase {
  public constructor(
    @Inject(USERS_QUERY_REPOSITORY)
    private readonly repository: IUsersQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,
  ) {}

  public async execute(): Promise<FindUsersResponse[]> {
    const cacheKey = 'users';

    const cached = await this.cache.get<FindUsersResponse[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const users = await this.repository.findAll();
    await this.cache.set(cacheKey, users);

    return users.map(
      (user) =>
        new FindUsersResponse(
          user.id,
          user.firstName,
          user.lastName,
          user.email,
          user.gender,
          user.roleId,
          user.isActive,
        ),
    );
  }
}
