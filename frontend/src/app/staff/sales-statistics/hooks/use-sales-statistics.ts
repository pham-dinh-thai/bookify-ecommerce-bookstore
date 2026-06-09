import { useCallback, useEffect, useState } from 'react';
import {
  mockSalesStatisticsBySelection,
  SalesPeriod,
  SalesStatistics,
} from '../data/mock-sales-statistics';
import salesStatisticsService from '../services/sales-statistics.service';

export default function useSalesStatistics(period: SalesPeriod, value: string) {
  const fallback =
    mockSalesStatisticsBySelection[period][value] ??
    Object.values(mockSalesStatisticsBySelection[period])[0];
  const [statistics, setStatistics] = useState<SalesStatistics>(fallback);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [usingFallback, setUsingFallback] = useState(true);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await salesStatisticsService(period, value);
      setStatistics(data);
      setUsingFallback(false);
    } catch (err) {
      setStatistics(fallback);
      setUsingFallback(true);
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to load sales statistics'),
      );
    } finally {
      setLoading(false);
    }
  }, [fallback, period, value]);

  useEffect(() => {
    void Promise.resolve().then(fetchStatistics);
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    usingFallback,
    refetch: fetchStatistics,
  };
}
