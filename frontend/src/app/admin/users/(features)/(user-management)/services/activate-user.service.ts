import { getAccessToken } from '@/shared/auth/lib/token-storage';

export const activateUserService = async (id: string) => {
  const token = getAccessToken();

  const res = await fetch(`/api/users/${id}/activate`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();

  let parsed: any = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    throw {
      message: parsed?.message || text || 'Something went wrong',
      code: parsed?.code,
    };
  }

  return parsed;
};
