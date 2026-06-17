'use client';

import { Search, X } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type NavSearchProps = {};

export default function NavSearch({}: NavSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = keyword.trim();

    if (!query) {
      router.push('/books');
      return;
    }

    router.push(`/books?q=${encodeURIComponent(query)}`);
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <>
      {/* Desktop search bar */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center gap-2 bg-[#eff5ef] rounded-full px-4 h-9 w-[clamp(50px,50%,600px)] min-w-0 md:flex-initial"
      >
        <Search
          size={14}
          strokeWidth={2.2}
          className="text-[#047857B3] shrink-0"
        />
        <input
          type="text"
          placeholder="Search books..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="bg-transparent border-none outline-none text-[13px] text-[#2b352f] placeholder:text-[#aab4ad] w-full"
        />
      </form>

      {/* Mobile search */}
      <div className="md:hidden flex-1 flex justify-end">
        {!open ? (
          <button
            type="button"
            onClick={handleOpen}
            className="flex items-center justify-center bg-[#eff5ef] rounded-full w-9 h-9 text-[#047857B3] hover:text-[#2b352f] transition-colors shrink-0"
            aria-label="Open search"
          >
            <Search size={14} strokeWidth={2.2} />
          </button>
        ) : (
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 bg-[#eff5ef] rounded-full px-3 h-9 w-full max-w-full ml-2"
          >
            <Search
              size={14}
              strokeWidth={2.2}
              className="text-[#047857B3] shrink-0"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="bg-transparent border-none outline-none text-[13px] text-[#2b352f] placeholder:text-[#aab4ad] w-full min-w-0"
            />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setKeyword('');
              }}
              className="text-[#047857B3] hover:text-[#2b352f] shrink-0"
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </form>
        )}
      </div>
    </>
  );
}
