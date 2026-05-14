export interface IJwtService {
  verify(token: string, secret: string): Record<string, unknown>;
}

export const JWt_SERVICE = 'IJwtService';
