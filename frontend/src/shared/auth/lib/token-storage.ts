let accessToken: string | null = null;
let explicitLogin = false;

export function setAccessToken(token: string): void {
  accessToken = token;
  window.dispatchEvent(new Event('auth-changed'));
}

export function signIn(token: string): void {
  accessToken = token;
  explicitLogin = true;
  window.dispatchEvent(new Event('auth-changed'));
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function isExplicitLogin(): boolean {
  return explicitLogin;
}

export function clearAccessToken(): void {
  accessToken = null;
  explicitLogin = false;
  window.dispatchEvent(new Event('auth-changed'));
}
