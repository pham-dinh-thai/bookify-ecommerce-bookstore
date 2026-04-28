const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY || 'bookify_access_token';
const REFRESH_TOKEN_KEY =
  process.env.REFRESH_TOKEN_KEY || 'bookify_refresh_token';

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
