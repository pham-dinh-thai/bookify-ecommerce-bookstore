import { getAccessToken } from '@/shared/auth/lib/token-storage';

export const findOneUserService = async (id: string) => {
  const token = getAccessToken();

  const res = await fetch(`/api/users/${id}`, {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  return await res.json();
};
