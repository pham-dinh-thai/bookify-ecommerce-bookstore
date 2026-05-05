import { getAccessToken } from '@/shared/auth/lib/token-storage';

export const allGenreService = async () => {
  const token = getAccessToken();

  const res = await fetch('/api/genres', {
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
