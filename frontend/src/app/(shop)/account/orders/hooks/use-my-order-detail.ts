'use client';

import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useCallback, useEffect, useState } from 'react';
import { findMyOrderDetailService } from '../services/my-orders.service';
import { MyOrderDetail } from '../types';

async function ensureAccessToken(): Promise<boolean> {
  if (getAccessToken()) return true;

  const token = await refreshAccessToken();
  return Boolean(token);
}

export function useMyOrderDetail(orderId: string) {
  const [order, setOrder] = useState<MyOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const hasToken = await ensureAccessToken();
      if (!hasToken) {
        setOrder(null);
        setError('Please log in to view this order.');
        return;
      }

      const data = await findMyOrderDetailService(orderId);
      setOrder(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to load order detail.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadOrder();
    });
  }, [loadOrder]);

  return {
    order,
    loading,
    error,
    retry: loadOrder,
  };
}
