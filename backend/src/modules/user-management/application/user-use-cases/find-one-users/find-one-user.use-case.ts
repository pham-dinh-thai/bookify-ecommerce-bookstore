import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersQueryRepository,
  USERS_QUERY_REPOSITORY,
} from '../../../domain/user-aggregate/repositories/users-query.repository.interface';
import { FindOneUserResponse } from './find-one-user.response';

@Injectable()
export class FindOneUserUseCase {
  public constructor(
    @Inject(USERS_QUERY_REPOSITORY)
    private readonly repository: IUsersQueryRepository,
  ) {}

  public async execute(id: string): Promise<FindOneUserResponse | null> {
    const user = await this.repository.findOne(id);

    return user
      ? new FindOneUserResponse(
          user.id,
          user.firstName,
          user.lastName,
          user.email,
          user.gender,
          user.roleId,
          user.isActive,
        )
      : null;
  }
}
