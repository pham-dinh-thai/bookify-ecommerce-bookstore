'use client';

import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useCallback, useEffect, useState } from 'react';
import { findMyOrdersService } from '../services/my-orders.service';
import { MyOrder } from '../types';

async function ensureAccessToken(): Promise<boolean> {
  if (getAccessToken()) return true;

  const token = await refreshAccessToken();
  return Boolean(token);
}

export function useMyOrders() {
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const hasToken = await ensureAccessToken();
      if (!hasToken) {
        setOrders([]);
        setError('Please log in to view your orders.');
        return;
      }

      const data = await findMyOrdersService();
      setOrders(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to load your orders.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadOrders();
    });
  }, [loadOrders]);

  return {
    orders,
    loading,
    error,
    retry: loadOrders,
  };
}
