import { jwtDecode } from 'jwt-decode';
import { getAccessToken } from '@/shared/auth/lib/token-storage';

export type JwtPayload = {
  sub: string;
  email: string;
  roleId: string;
  sessionId: string;
  exp: number;
};

export function getAuthState(): {
  isAuth: boolean;
  roleId: string | null;
  user: JwtPayload | null;
} {
  const token = getAccessToken();
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
