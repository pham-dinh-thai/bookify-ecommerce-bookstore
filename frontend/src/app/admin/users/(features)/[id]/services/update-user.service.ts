import { getAccessToken } from '@/shared/auth/lib/token-storage';

export const updateUserService = async (id: string, data: EditUserForm) => {
  const token = getAccessToken();

  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  console.log('RESPONSE:', text);

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
