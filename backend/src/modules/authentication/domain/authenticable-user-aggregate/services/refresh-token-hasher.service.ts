export interface IRefreshTokenHasherService {
  hash(refreshToken: string): string;
}

export const REFRESH_TOKEN_HASHER = 'IRefreshTokenHasherService';
