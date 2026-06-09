import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { SalesPeriod, SalesStatistics } from '../data/mock-sales-statistics';

export default async function salesStatisticsService(
  period: SalesPeriod,
  value: string,
): Promise<SalesStatistics> {
  const token = getAccessToken();
  const params = new URLSearchParams({ period, value });

  const res = await fetch(`/api/sales-statistics?${params.toString()}`, {
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
