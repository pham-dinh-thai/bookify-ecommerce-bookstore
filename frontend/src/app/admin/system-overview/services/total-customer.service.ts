import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';

export default async function totalCustomerService() {
  if (!getAccessToken()) {
    await refreshAccessToken();
  }

  const token = getAccessToken();

  const res = await fetch('/api/customers/total', {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
}
