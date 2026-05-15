import NavLinks from './partials/nav-links';
import NavLogo from './partials/nav-logo';
import NavSearch from './partials/nav-search';
import NavUserMenu from './partials/nav-user-menu';
import NavWrapper from './partials/nav-wrapper';

type NavigationBarPresenterProps = {
  navLinks: NavLink[];
  genres: GenreLink[];
  appName: string;
};

export default function NavigationBarPresenter({
  navLinks,
  appName,
  genres,
}: NavigationBarPresenterProps) {
  return (
    <NavWrapper>
      <nav
        className="mx-auto flex h-[52px] w-full max-w-8xl items-center justify-between rounded-full px-7"
        style={{
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0px 20px 40px rgba(43, 53, 47, 0.06)',
        }}
      >
        <NavLogo appName={appName} />

        <NavLinks navLinks={navLinks} genres={genres} />

        <NavSearch />

        <NavUserMenu />
      </nav>
    </NavWrapper>
  );
}
