import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';

export default async function totalBookService() {
  if (!getAccessToken()) {
    await refreshAccessToken();
  }

  const token = getAccessToken();

  const res = await fetch('/api/books/total', {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  if (!text) {
    return 0;
  }

  return JSON.parse(text);
}
