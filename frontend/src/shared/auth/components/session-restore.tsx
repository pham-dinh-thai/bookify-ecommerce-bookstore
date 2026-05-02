'use client';

import { useEffect } from 'react';
import {
  clearAccessToken,
  setAccessToken,
} from '@/shared/auth/lib/token-storage';

async function refreshSession() {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const { accessToken } = await response.json();
      setAccessToken(accessToken);
    }
  } catch {}
}

export default function SessionRestore() {
  useEffect(() => {
    refreshSession();
    const interval = setInterval(refreshSession, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
