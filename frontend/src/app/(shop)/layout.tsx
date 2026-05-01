'use client';

import React, { useEffect, useState } from 'react';
import FooterContainer from './components/footer/footer.container';
import NavigationBarContainer from './components/navigation-bar/navigation-bar.container';
import { setAccessToken } from '@/shared/auth/lib/token-storage';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          const { accessToken } = await response.json();
          setAccessToken(accessToken);
        }
      } finally {
        setIsReady(true);
      }
    }

    restoreSession();
  }, []);

  if (!isReady) return null;

  return (
    <div className="min-h-screen bg-[#f7faf5] flex flex-col">
      <NavigationBarContainer />
      <main className="flex-1 pt-[76px]">{children}</main>
      <FooterContainer />
    </div>
  );
}
