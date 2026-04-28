export interface ISignTokenService {
  sign(sub: string, roleId: string): string;
}

export const SIGN_TOKEN_SERVICE = 'ISignTokenService';
