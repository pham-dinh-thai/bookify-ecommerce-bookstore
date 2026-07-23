'use client';

import { Info, Lock, MapPin, ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

type AccountSidebarProps = {
  activeItem:
    | 'basic-information'
    | 'change-password'
    | 'contact-information'
    | 'orders';
};

export default function AccountSidebar({ activeItem }: AccountSidebarProps) {
  const t = useTranslations('account.sidebar');

  const navItems = [
    { href: '/account', icon: Info, id: 'basic-information' as const, label: t('basicInformation') },
    { href: '/account/contact-information', icon: MapPin, id: 'contact-information' as const, label: t('contactInformation') },
    { href: '/account/change-password', icon: Lock, id: 'change-password' as const, label: t('changePassword') },
    { href: '/account/orders', icon: ReceiptText, id: 'orders' as const, label: t('myOrders') },
  ];

  return (
    <aside className="w-full lg:w-64 lg:shrink-0">
      <div className="lg:top-28">
        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#58615b]/70">
          {t('title')}
        </p>
        <nav className="flex gap-2 overflow-x-scroll pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeItem;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex min-w-fit items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-colors lg:w-full ${
                  isActive
                    ? 'bg-[#c1ecd4] text-[#325947]'
                    : 'text-[#58615b] hover:bg-[#eff5ef] hover:text-[#325947]'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}

        </nav>
      </div>
    </aside>
  );
}
