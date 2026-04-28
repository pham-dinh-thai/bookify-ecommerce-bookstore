import { jwtDecode } from 'jwt-decode';

export type JwtPayload = {
  sub: string;
  email: string;
  roleId: string;
  exp: number;
};

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('bookify_access_token') ||
    sessionStorage.getItem('bookify_access_token')
  );
}

export function getAuthState(): {
  isAuth: boolean;
  roleId: string | null;
  user: JwtPayload | null;
} {
  const token = getToken();
  if (!token) return { isAuth: false, roleId: null, user: null };

  try {
    const payload = jwtDecode<JwtPayload>(token);
    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) return { isAuth: false, roleId: null, user: null };

    return {
      isAuth: true,
      roleId: payload.roleId,
      user: payload,
    };
  } catch {
    return { isAuth: false, roleId: null, user: null };
  }
}
