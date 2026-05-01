'use client';

import { useEffect } from 'react';
import { setAccessToken } from '@/shared/auth/lib/token-storage';

export default function SessionRestore() {
  useEffect(() => {
    async function restoreSession() {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const { accessToken } = await response.json();
        setAccessToken(accessToken);
      }
    }

    restoreSession();
  }, []);

  return null;
}
