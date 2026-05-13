import SessionRestore from '@/shared/auth/components/session-restore';
import StaffSidebar from './components/sidebar/staff-sidebar';
import { ToastProvider } from '@/shared/common/toast/toast';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7faf5] flex">
      <SessionRestore />

      <StaffSidebar />

      <main className="flex-1">
        <ToastProvider>{children}</ToastProvider>
      </main>
    </div>
  );
}
