import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';

export default async function totalStaffService() {
  if (!getAccessToken()) {
    await refreshAccessToken();
  }

  const token = getAccessToken();

  const res = await fetch('/api/users/total/staff', {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
}
