import { AuthenticableUser } from '../authenticable-user.aggregate';

export interface IAuthenticableUserCommandRepository {
  register(authUser: AuthenticableUser): Promise<void>;
}

export const AUTHENTICABLE_USER_COMMAND_REPOSITORY =
  'IAuthenticableUserCommandRepository';
