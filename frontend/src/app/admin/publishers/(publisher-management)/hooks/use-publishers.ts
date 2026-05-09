import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useEffect, useState } from 'react';
import { allPublisherService } from '../services/all-publisher.service';

export default function usePublishers(
  page: number,
  limit: number,
  search: string,
) {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [errors, setErrors] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchPublishers = async () => {
    setLoading(true);
    try {
      if (!getAccessToken()) {
        await refreshAccessToken();
      }

      const data = await allPublisherService(page, limit, search);

      setPublishers(data.publishers);
      setTotal(data.total);
    } catch (err: any) {
      setErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishers();
  }, [page, limit, search]);

  return { publishers, total, loading, errors, refetch: fetchPublishers };
}
