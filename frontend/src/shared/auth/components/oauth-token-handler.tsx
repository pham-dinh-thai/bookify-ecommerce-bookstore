'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { signIn } from '@/shared/auth/lib/token-storage';

export default function OAuthTokenHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      signIn(token);

      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  return null;
}
