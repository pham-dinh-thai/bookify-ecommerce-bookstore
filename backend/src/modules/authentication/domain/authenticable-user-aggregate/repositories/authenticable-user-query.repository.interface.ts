import { AuthenticableUserReadModel } from '../read-models/authenticable-user.read-model';

export interface IAuthenticableUserQueryRepository {
  findByEmail(email: string): Promise<AuthenticableUserReadModel | null>;
}

export const AUTHENTICABLE_USER_QUERY_REPOSITORY =
  'IAuthenticableUserQueryRepository';
