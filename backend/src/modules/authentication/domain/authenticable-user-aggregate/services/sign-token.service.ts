export interface ISignTokenService {
  sign(
    payload: Record<string, unknown>,
    secret: string,
    expiresIn: string,
  ): string;
}

export const SIGN_TOKEN_SERVICE = 'ISignTokenService';
