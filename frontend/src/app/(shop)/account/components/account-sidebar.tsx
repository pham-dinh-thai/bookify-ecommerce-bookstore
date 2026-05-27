'use client';

import { Info, Lock, MapPin, ReceiptText } from 'lucide-react';
import Link from 'next/link';

type AccountSidebarProps = {
  activeItem: 'basic-information' | 'change-password';
};

const navItems = [
  {
    href: '/account',
    icon: Info,
    id: 'basic-information',
    label: 'Basic Information',
  },
  {
    href: '/account/change-password',
    icon: Lock,
    id: 'change-password',
    label: 'Change Password',
  },
] as const;

const disabledItems = [
  { icon: MapPin, label: 'Contact Information' },
  { icon: ReceiptText, label: 'My Order' },
];

export default function AccountSidebar({ activeItem }: AccountSidebarProps) {
  return (
    <aside className="w-full lg:w-64 lg:shrink-0">
      <div className="lg:top-28">
        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#58615b]/70">
          My Account
        </p>
        <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
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

          {disabledItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                disabled
                className="flex min-w-fit cursor-not-allowed items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold text-[#58615b]/60 lg:w-full"
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
