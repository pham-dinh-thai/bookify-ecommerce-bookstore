import SessionRestore from '@/shared/auth/components/session-restore';
import { ToastProvider } from '@/shared/common/toast/toast';
import FooterContainer from './components/footer/footer.container';
import NavigationBarContainer from './components/navigation-bar/navigation-bar.container';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7faf5] flex flex-col">
      <ToastProvider>
        <SessionRestore />
        <NavigationBarContainer />
        <main className="flex-1 pt-[68px] md:pt-[80px]">{children}</main>
        <FooterContainer />
      </ToastProvider>
    </div>
  );
}
