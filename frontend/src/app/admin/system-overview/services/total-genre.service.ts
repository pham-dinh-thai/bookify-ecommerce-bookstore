import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';

export default async function totalGenreService() {
  if (!getAccessToken()) {
    await refreshAccessToken();
  }

  const token = getAccessToken();

  const res = await fetch('/api/genres/total', {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
}
