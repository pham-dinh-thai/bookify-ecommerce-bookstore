const ACCESS_TOKEN_KEY = 'bookify_access_token';
const REFRESH_TOKEN_KEY = 'bookify_refresh_token';

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

export function getAccessToken(): string | null {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  );
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}
