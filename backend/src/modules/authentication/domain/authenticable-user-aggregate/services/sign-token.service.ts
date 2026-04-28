export interface ISignTokenService {
  sign(sub: string, roleId: string, jti: string): string;
}

export const SIGN_TOKEN_SERVICE = 'ISignTokenService';
