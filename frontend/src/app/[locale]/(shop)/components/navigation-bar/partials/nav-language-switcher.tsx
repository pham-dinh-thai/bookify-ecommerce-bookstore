'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Globe } from 'lucide-react';

export default function NavLanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggle = () => {
    const next = locale === 'en' ? 'vi' : 'en';
    router.replace(pathname, { locale: next });
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 text-[#047857B3] hover:text-[#2b352f] transition-colors p-1"
      aria-label="Switch language"
      title={locale === 'en' ? 'Chuyển sang tiếng Việt' : 'Switch to English'}
    >
      <Globe size={16} strokeWidth={1.7} />
      <span className="text-[11px] font-bold tracking-wider">{locale.toUpperCase()}</span>
    </button>
  );
}
