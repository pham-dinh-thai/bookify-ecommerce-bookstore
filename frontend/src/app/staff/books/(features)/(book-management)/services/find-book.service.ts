import { getAccessToken } from '@/shared/auth/lib/token-storage';

export const findBookService = async (id: string) => {
  const token = getAccessToken();

  const res = await fetch(`/api/books/${id}`, {
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
