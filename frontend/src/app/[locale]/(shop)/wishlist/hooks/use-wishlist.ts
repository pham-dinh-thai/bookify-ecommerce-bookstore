'use client';

import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { useCallback, useEffect, useState } from 'react';
import { findWishlistService } from '../services/wishlist.service';
import { WishlistItem } from '../types';

async function ensureAccessToken(): Promise<boolean> {
  if (getAccessToken()) return true;

  const token = await refreshAccessToken();
  return Boolean(token);
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWishlist = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const hasToken = await ensureAccessToken();
      if (!hasToken) {
        setItems([]);
        setError('Please log in to view your wishlist.');
        return;
      }

      const data = await findWishlistService();
      setItems(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to load your wishlist.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadWishlist();
    });
  }, [loadWishlist]);

  return {
    items,
    loading,
    error,
    retry: loadWishlist,
  };
}
