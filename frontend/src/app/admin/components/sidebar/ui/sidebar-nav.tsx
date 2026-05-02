import Link from 'next/link';

type NavItem = {
  label: string;
  icon: any;
  path: string;
};

type SidebarNavProps = {
  navItems: NavItem[];
  pathname: string;
};

export default function SidebarNav({ navItems, pathname }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-0.5 flex-1">
      {navItems.map(({ label, icon: Icon, path }) => {
        const isActive = pathname === path;
        return (
          <Link
            key={path}
            href={path}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
              isActive
                ? 'bg-[#e8f5ee] text-[#2d6a4f] font-semibold'
                : 'text-[#58615b] hover:bg-[#f0f7f3] hover:text-[#2d6a4f]'
            }`}
          >
            <Icon size={16} strokeWidth={1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
