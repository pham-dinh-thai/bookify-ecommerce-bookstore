import { useAuth } from '@/shared/auth/hooks/use-auth';
import {
  clearAccessToken,
  getAccessToken,
} from '@/shared/auth/lib/token-storage';
import { Settings, LogOut, Home, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SidebarFooter() {
  const router = useRouter();

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
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-0.5">
      <Link
        href="/"
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Home size={16} strokeWidth={1.8} />
        Go to Homepage
      </Link>
      <Link
        href="/admin/profile"
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <User size={16} strokeWidth={1.8} />
        My Account
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors w-full"
      >
        <LogOut size={16} strokeWidth={1.8} />
        Logout
      </button>
    </div>
  );
}
