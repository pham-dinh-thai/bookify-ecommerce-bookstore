import SessionRestore from '@/shared/auth/components/session-restore';
import AdminSidebar from './components/sidebar/admin-sidebar';
import AdminNavBar from './components/nav-bar/admin-nav-bar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7faf5] flex">
      <SessionRestore />

      <AdminSidebar />

      <main className="flex-1">
        <AdminNavBar />
        {children}
      </main>
    </div>
  );
}
