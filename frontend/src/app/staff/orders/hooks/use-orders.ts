import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useCallback, useEffect, useState } from 'react';
import { Order } from '../types';
import { allOrderService } from '../services/all-order.service';

export default function useOrders(page: number, limit: number, search: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [errors, setErrors] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setErrors(null);

    try {
      if (!getAccessToken()) {
        await refreshAccessToken();
      }

      const data = await allOrderService(page, limit, search);
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
      setTotal(Number(data?.total) || 0);
    } catch (err: unknown) {
      setErrors(err instanceof Error ? err : new Error('Failed to load orders'));
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    void Promise.resolve().then(fetchOrders);
  }, [fetchOrders]);

  return { orders, total, loading, errors, refetch: fetchOrders };
}
