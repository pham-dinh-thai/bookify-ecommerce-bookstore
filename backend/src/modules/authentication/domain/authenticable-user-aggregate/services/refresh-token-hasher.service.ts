export interface IRefreshTokenHasherService {
  hash(refreshToken: string): string;

  verify(refreshToken: string, storedHash: string): boolean;
}

export const REFRESH_TOKEN_HASHER = 'IRefreshTokenHasherService';
