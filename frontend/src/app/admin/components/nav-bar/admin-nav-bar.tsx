import NavLogo from './ui/nav-logo';
import NavUserMenu from './ui/nav-user-menu';

export default function AdminNavBar({}) {
  return (
    <header className="w-full flex items-center justify-center top-0 px-12 py-3.5">
      <nav
        className="flex items-center justify-between w-full max-w-8xl h-[52px] px-7 rounded-full"
        style={{
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0px 20px 40px rgba(43, 53, 47, 0.06)',
        }}
      >
        <NavLogo appName="Bookify" />

        <NavUserMenu />
      </nav>
    </header>
  );
}
