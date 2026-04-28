'use client';

import {
  clearTokens,
  getAccessToken,
} from '@/app/(authentication)/lib/token-storage';
import { useDropdown } from '@/app/(shop)/hooks/useDropdown';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type NavUserMenuProps = {};

export default function NavUserMenu({}: NavUserMenuProps) {
  const dropdown = useDropdown();
  const { isAuth, roleId } = useAuth();
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    try {
      const accessToken = getAccessToken();

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
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
      clearTokens();
      dropdown.close();
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-3.5 shrink-0">
      <button className="text-[#047857B3] hover:text-[#2b352f] transition-colors">
        <ShoppingCart size={17} strokeWidth={1.7} />
      </button>

      <div className="relative" ref={dropdown.ref}>
        <button
          onClick={dropdown.toggle}
          className="text-[#047857B3] hover:text-[#2b352f] transition-colors"
        >
          <User size={17} strokeWidth={1.7} />
        </button>
        {dropdown.isOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            {isAuth ? (
              <>
                <Link
                  href="/account"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={dropdown.close}
                >
                  My Account
                </Link>
                {roleId === 'admin' && (
                  <Link
                    href="/users"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={dropdown.close}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={dropdown.close}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={dropdown.close}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
