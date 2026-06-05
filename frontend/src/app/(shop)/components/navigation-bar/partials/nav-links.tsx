import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

type NavLinksProps = {
  navLinks: NavLink[];
  genres: GenreLink[];
};

export default function NavLinks({ navLinks, genres }: NavLinksProps) {
  return (
    <ul className="flex items-center gap-7">
      <li className="relative group">
        <button
          type="button"
          className="text-[13.5px] font-medium text-[#047857B3] hover:text-[#2b352f] transition-colors inline-flex items-center"
        >
          Genre
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        <div className="absolute left-0 top-full z-20 hidden min-w-[220px] pt-2 group-hover:block">
          <ul className="max-h-[360px] overflow-y-auto rounded-2xl border border-[#0478571a] bg-white/95 p-2 shadow-lg backdrop-blur-sm">
            {genres.map((genre) => (
              <li key={genre.label}>
                <Link
                  href={genre.path}
                  className="block rounded-xl px-3 py-2 text-[13px] text-[#2b352f] hover:bg-[#f0f7f3]"
                >
                  {genre.label}
                </Link>
              </li>
            ))}
            <li className="mt-1 border-t border-[#0478571a] pt-1">
              <Link
                href="/books"
                className="block rounded-xl px-3 py-2 text-[13px] font-medium text-[#047857] hover:bg-[#f0f7f3]"
              >
                View all books
              </Link>
            </li>
          </ul>
        </div>
      </li>

      {navLinks.map((link) => (
        <li key={link.label}>
          <Link
            href={link.path}
            className="text-[13.5px] font-medium text-[#047857B3] hover:text-[#2b352f] transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
