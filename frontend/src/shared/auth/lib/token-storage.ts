let accessToken: string | null = null;

export function setAccessToken(token: string): void {
  accessToken = token;
  window.dispatchEvent(new Event('auth-changed'));
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function clearAccessToken(): void {
  accessToken = null;
  window.dispatchEvent(new Event('auth-changed'));
}
