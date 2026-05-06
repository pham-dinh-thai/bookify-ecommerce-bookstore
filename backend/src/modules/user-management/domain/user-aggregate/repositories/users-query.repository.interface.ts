import { UserReadModel } from '../read-models/user.read-model';

export interface IUsersQueryRepository {
  findAll(): Promise<UserReadModel[]>;

  findOne(id: string): Promise<UserReadModel | null>;

  countByRole(roleId: string): Promise<number>;
}

export const USERS_QUERY_REPOSITORY = 'IUsersQueryRepository';
