'use client';

import { useDropdown } from '@/app/[locale]/(shop)/hooks/use-dropdown';
import { useAuth } from '@/shared/auth/hooks/use-auth';
import {
  clearAccessToken,
  getAccessToken,
} from '@/shared/auth/lib/token-storage';
import { Heart, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function NavUserMenu() {
  const { close, isOpen, ref, toggle } = useDropdown();
  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations('nav');

  const handleLogout = async (): Promise<void> => {
    try {
      const accessToken = getAccessToken();

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });

      if (!response.ok) {
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        const message = Array.isArray(data.message)
          ? data.message[0]
          : data.message;
        throw new Error(message || 'Logout failed');
      }
    } finally {
      clearAccessToken();
      close();
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-3.5 shrink-0">
      <Link
        href="/wishlist"
        className="text-[#047857B3] hover:text-[#2b352f] transition-colors"
        aria-label="Open wishlist"
      >
        <Heart size={17} strokeWidth={1.7} />
      </Link>

      <Link
        href="/cart"
        className="text-[#047857B3] hover:text-[#2b352f] transition-colors"
        aria-label="Open cart"
      >
        <ShoppingCart size={17} strokeWidth={1.7} />
      </Link>

      <div className="relative" ref={ref}>
        <button
          onClick={toggle}
          className="text-[#047857B3] hover:text-[#2b352f] transition-colors"
        >
          <User size={17} strokeWidth={1.7} />
        </button>
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            {auth.isAuth ? (
              <>
                <Link
                  href="/account"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={close}
                >
                  {t('myAccount')}
                </Link>
                <Link
                  href="/account/orders"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={close}
                >
                  {t('myOrders')}
                </Link>
                {auth.roleId === 'admin' && (
                  <Link
                    href="/admin/system-overview"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={close}
                  >
                    {t('dashboard')}
                  </Link>
                )}

                {auth.roleId === 'staff' && (
                  <Link
                    href="/staff/system-overview"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={close}
                  >
                    {t('dashboard')}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={close}
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={close}
                >
                  {t('register')}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
