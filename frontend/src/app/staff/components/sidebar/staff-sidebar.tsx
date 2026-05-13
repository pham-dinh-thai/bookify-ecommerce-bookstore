'use client';

import {
  ArrowUp01,
  Book,
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import SidebarNav from './ui/sidebar-nav';
import SidebarFooter from './ui/sidebar-footer';
import SidebarBrand from './ui/sidebar-brand';

const navItems = [
  {
    label: 'System Overview',
    icon: LayoutDashboard,
    path: '/staff/system-overview',
  },

  { label: 'Book Management', icon: Book, path: '/staff/books' },
  { label: 'Stock Management', icon: ArrowUp01, path: '/staff/stock' },
  { label: 'Order Management', icon: ShoppingBag, path: '/staff/orders' },
  {
    label: 'Customer Management',
    icon: ShoppingCart,
    path: '/staff/customers',
  },
];

export default function StaffSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-[250px] bg-[#dff0e0] flex flex-col px-3 py-5 shrink-0 h-screen sticky top-0"
      style={{ boxShadow: '2px 0px 12px rgba(43,53,47,0.06)' }}
    >
      <SidebarBrand />

      <SidebarNav navItems={navItems} pathname={pathname} />

      <div className="h-px bg-[#e8ede9] my-3" />

      <SidebarFooter />
    </aside>
  );
}
