const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY || 'bookify_access_token';
const REFRESH_TOKEN_KEY =
  process.env.REFRESH_TOKEN_KEY || 'bookify_refresh_token';

export function saveTokens(
  accessToken: string,
  refreshToken: string,
  remember: boolean,
): void {
  const activeStorage = remember ? localStorage : sessionStorage;
  const inactiveStorage = remember ? sessionStorage : localStorage;

  inactiveStorage.removeItem(ACCESS_TOKEN_KEY);
  inactiveStorage.removeItem(REFRESH_TOKEN_KEY);

  activeStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  activeStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}
