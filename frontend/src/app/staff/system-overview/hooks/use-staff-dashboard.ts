import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useCallback, useEffect, useState } from 'react';
import staffDashboardService from '../services/staff-dashboard.service';
import { StaffDashboard } from '../types';

export default function useStaffDashboard() {
  const [dashboard, setDashboard] = useState<StaffDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!getAccessToken()) {
        await refreshAccessToken();
      }

      const data = await staffDashboardService();
      setDashboard(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to load staff dashboard'),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchDashboard);
  }, [fetchDashboard]);

  return { dashboard, loading, error, refetch: fetchDashboard };
}
