'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { allGenreService } from '@/app/admin/genres/(genre-management)/services/all-genre.service';

type NavLinksProps = {
  navLinks: NavLink[];
};

export default function NavLinks({ navLinks }: NavLinksProps) {
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const dropdownRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoadingGenres(true);
      try {
        const res = await allGenreService(1, 50, '');
        setGenres((res?.genres ?? []).map((genre) => ({ id: genre.id, name: genre.name })));
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setGenreDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <>
      <ul className="flex items-center gap-7">
        {navLinks.map((link) => (
          <li
            key={link.label}
            className="relative"
            ref={link.children ? dropdownRef : null}
          >
            {link.children ? (
              <button
                type="button"
                onClick={() => setGenreDropdownOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 text-[13.5px] font-medium text-[#047857B3] hover:text-[#2b352f] transition-colors"
              >
                Genres
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Link
                href={link.path || '#'}
                className="text-[13.5px] font-medium text-[#047857B3] hover:text-[#2b352f] transition-colors"
              >
                {link.label}
              </Link>
            )}

            {link.children && genreDropdownOpen ? (
              <div className="absolute left-0 top-8 z-50 min-w-56 rounded-xl bg-white p-3 shadow-[0px_20px_40px_rgba(43,53,47,0.06)]">
                {loadingGenres ? (
                  <p className="text-sm text-[#58615b]">Loading...</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {genres.map((genre) => (
                      <li key={genre.id}>
                        <Link
                          href={`/genres?id=${genre.id}`}
                          className="block rounded-md px-2 py-1.5 text-sm text-[#58615b] hover:bg-[#f7faf5] hover:text-[#2b352f]"
                          onClick={() => setGenreDropdownOpen(false)}
                        >
                          {genre.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
