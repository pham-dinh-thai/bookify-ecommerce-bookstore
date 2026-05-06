import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useEffect, useState } from 'react';
import { RecentActivity } from '../types';
import { recentActivitiesService } from '../services/recent-activities.service';

export default function useRecentActivities() {
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    [],
  );
  const [errors, setErrors] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchRecentActivities = async () => {
    setLoading(true);
    try {
      if (!getAccessToken()) {
        await refreshAccessToken();
      }

      const data = await recentActivitiesService();

      setRecentActivities(data);
    } catch (err: any) {
      setErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  return { recentActivities, loading, errors, refetch: fetchRecentActivities };
}
