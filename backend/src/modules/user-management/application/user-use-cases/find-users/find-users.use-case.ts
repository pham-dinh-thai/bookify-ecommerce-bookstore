import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersQueryRepository,
  USERS_QUERY_REPOSITORY,
} from '../../../domain/user-aggregate/repositories/users-query.repository.interface';
import { FindUsersResponse } from './find-users.response';

@Injectable()
export class FindUsersUseCase {
  public constructor(
    @Inject(USERS_QUERY_REPOSITORY)
    private readonly repository: IUsersQueryRepository,
  ) {}

  public async execute(): Promise<FindUsersResponse[]> {
    const users = await this.repository.findAll();

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
