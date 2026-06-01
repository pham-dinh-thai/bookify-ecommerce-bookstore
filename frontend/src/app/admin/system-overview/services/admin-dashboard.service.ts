import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { AdminDashboard } from '../types';

export default async function adminDashboardService(): Promise<AdminDashboard> {
  const token = getAccessToken();

  const res = await fetch('/api/admin-dashboard', {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  return await res.json();
}
