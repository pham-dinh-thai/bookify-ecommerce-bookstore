'use client';

import {
  AlignEndHorizontal,
  BookOpen,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import SidebarNav from './ui/sidebar-nav';
import SidebarFooter from './ui/sidebar-footer';
import SidebarBrand from './ui/sidebar-brand';

const navItems = [
  {
    label: 'System Overview',
    icon: LayoutDashboard,
    path: '/admin/system-overview',
  },
  { label: 'Genre Management', icon: BookOpen, path: '/genres' },
  { label: 'User Management', icon: Users, path: '/users' },
  { label: 'Statistics', icon: AlignEndHorizontal, path: '/statistics' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-[250px] bg-[#dff0e0] flex flex-col px-3 py-5 shrink-0 min-h-screen"
      style={{ boxShadow: '2px 0px 12px rgba(43,53,47,0.06)' }}
    >
      <SidebarBrand />

      <SidebarNav navItems={navItems} pathname={pathname} />

      <div className="h-px bg-[#e8ede9] my-3" />

      <SidebarFooter />
    </aside>
  );
}
