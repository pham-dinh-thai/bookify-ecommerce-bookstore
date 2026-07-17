import { AuthenticableUser } from '../authenticable-user.aggregate';

export interface IAuthenticableUserCommandRepository {
  register(authUser: AuthenticableUser): Promise<void>;

  verifyAndActivateUser(authUser: AuthenticableUser): Promise<void>;

  findByEmail(email: string): Promise<AuthenticableUser>;

  findByProvider(
    provider: string,
    providerId: string,
  ): Promise<AuthenticableUser | null>;
}

export const AUTHENTICABLE_USER_COMMAND_REPOSITORY =
  'IAuthenticableUserCommandRepository';
