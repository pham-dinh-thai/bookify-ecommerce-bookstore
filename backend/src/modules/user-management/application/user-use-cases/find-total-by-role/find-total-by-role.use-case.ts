import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersQueryRepository,
  USERS_QUERY_REPOSITORY,
} from '../../../domain/user-aggregate/repositories/users-query.repository.interface';

@Injectable()
export class FindTotalByRoleUseCase {
  public constructor(
    @Inject(USERS_QUERY_REPOSITORY)
    private readonly repository: IUsersQueryRepository,
  ) {}

  public async execute(roleId: string): Promise<number> {
    const total = await this.repository.countByRole(roleId);

    return total;
  }
}
