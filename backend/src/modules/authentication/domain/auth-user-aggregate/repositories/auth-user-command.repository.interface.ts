import { AuthUser } from '../user.aggregate';

export interface IAuthUserCommandRepository {
  register(authUser: AuthUser): Promise<void>;
}

export const IAuthUserCommandRepository = 'IAuthUserCommandRepository';
