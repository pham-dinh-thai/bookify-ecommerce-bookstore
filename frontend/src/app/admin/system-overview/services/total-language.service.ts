import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';

export default async function totalLanguageService() {
  if (!getAccessToken()) {
    await refreshAccessToken();
  }

  const token = getAccessToken();

  const res = await fetch('/api/languages/total', {
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
