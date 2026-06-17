'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <NavWrapper>
      <nav
        className="mx-auto flex h-[52px] w-full max-w-8xl items-center justify-between rounded-full px-4 md:px-7"
        style={{
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0px 20px 40px rgba(43, 53, 47, 0.06)',
        }}
      >
        <NavLogo appName={appName} />

        <div className="hidden md:flex items-center gap-7">
          <NavLinks navLinks={navLinks} genres={genres} />
        </div>

        <NavSearch />

        <div className="flex items-center gap-1">
          <NavUserMenu />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#047857B3] hover:text-[#2b352f] transition-colors p-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden mt-2 rounded-2xl border border-[#0478571a] bg-white/95 p-4 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#4a7c60] px-3 pt-1 pb-2">
              Genre
            </p>
            {genres.map((genre) => (
              <Link
                key={genre.label}
                href={genre.path}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-[14px] text-[#2b352f] hover:bg-[#f0f7f3]"
              >
                {genre.label}
              </Link>
            ))}
            <div className="border-t border-[#0478571a] my-2" />
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-[14px] font-medium text-[#047857] hover:bg-[#f0f7f3]"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[#0478571a] my-2" />
            <Link
              href="/books"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-[14px] font-medium text-[#047857] hover:bg-[#f0f7f3]"
            >
              View all books
            </Link>
          </div>
        </div>
      )}
    </NavWrapper>
  );
}
