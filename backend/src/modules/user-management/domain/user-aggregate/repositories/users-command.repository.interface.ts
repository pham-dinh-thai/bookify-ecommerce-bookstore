import { User } from '../user.aggregate';

export interface IUsersCommandRepository {
  findOne(id: string): Promise<User>;

  save(user: User): Promise<void>;

  updateGender(userId: string, gender: string): Promise<void>;

  delete(user: User): Promise<void>;
}

export const USERS_COMMAND_REPOSITORY = 'IUsersCommandRepository';
