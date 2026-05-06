import { getAccessToken } from '@/shared/auth/lib/token-storage';

export const allAuditLogsService = async () => {
  const token = getAccessToken();

  const res = await fetch('/api/audit-logs', {
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
