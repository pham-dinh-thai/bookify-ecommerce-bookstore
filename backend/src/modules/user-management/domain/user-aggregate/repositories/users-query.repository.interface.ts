import { UserReadModel } from '../read-models/user.read-model';
import { UserFilter } from '../user-filter';

export interface IUsersQueryRepository {
  findAll(
    page: number,
    limit: number,
    filter?: UserFilter,
    search?: string,
  ): Promise<UserReadModel[]>;

  findOne(id: string): Promise<UserReadModel | null>;

  count(filter?: UserFilter, search?: string): Promise<number>;

  countByRole(roleId: string): Promise<number>;
}

export const USERS_QUERY_REPOSITORY = 'IUsersQueryRepository';
