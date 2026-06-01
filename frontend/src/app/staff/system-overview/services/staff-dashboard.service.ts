import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { StaffDashboard } from '../types';

export default async function staffDashboardService(): Promise<StaffDashboard> {
  const token = getAccessToken();

  const res = await fetch('/api/staff-dashboard', {
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
