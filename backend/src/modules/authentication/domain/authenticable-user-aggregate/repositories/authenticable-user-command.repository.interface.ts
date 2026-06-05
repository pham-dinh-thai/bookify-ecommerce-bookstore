import { AuthenticableUser } from '../authenticable-user.aggregate';

export interface IAuthenticableUserCommandRepository {
  register(authUser: AuthenticableUser): Promise<void>;

  activateUser(userId: string): Promise<void>;

  findByEmail(email: string): Promise<AuthenticableUser>;
}

export const AUTHENTICABLE_USER_COMMAND_REPOSITORY =
  'IAuthenticableUserCommandRepository';
