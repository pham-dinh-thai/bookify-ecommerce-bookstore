import { useCallback, useEffect, useState } from 'react';
import { SalesPeriod, SalesStatistics } from '../types';
import salesStatisticsService from '../services/sales-statistics.service';

export default function useSalesStatistics(period: SalesPeriod, value: string) {
  const [statistics, setStatistics] = useState<SalesStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    setStatistics(null);

    try {
      const data = await salesStatisticsService(period, value);
      setStatistics(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to load sales statistics'),
      );
    } finally {
      setLoading(false);
    }
  }, [period, value]);

  useEffect(() => {
    void Promise.resolve().then(fetchStatistics);
  }, [fetchStatistics]);

  return { statistics, loading, error, refetch: fetchStatistics };
}
