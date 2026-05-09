'use client';

import {
  BookOpen,
  BookUser,
  Building2,
  ClipboardList,
  LanguagesIcon,
  LayoutDashboard,
  PenLine,
  ShoppingCart,
  Tag,
  Users,
  User,
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

  { label: 'User Management', icon: Users, path: '/admin/users' },
  {
    label: 'Customer Management',
    icon: ShoppingCart,
    path: '/admin/customers',
  },
  { label: 'Genre Management', icon: Tag, path: '/admin/genres' },
  { label: 'Author Management', icon: PenLine, path: '/admin/authors' },
  {
    label: 'Publisher Management',
    icon: Building2,
    path: '/admin/publishers',
  },
  {
    label: 'Language Management',
    icon: LanguagesIcon,
    path: '/admin/languages',
  },
  {
    label: 'Audit Log',
    icon: ClipboardList,
    path: '/admin/audit-logs',
  },
];

export default function AdminSidebar() {
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
