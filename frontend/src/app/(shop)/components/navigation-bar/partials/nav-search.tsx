'use client';

import { Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type NavSearchProps = {};

export default function NavSearch({}: NavSearchProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = keyword.trim();

    if (!query) {
      router.push('/books');
      return;
    }

    router.push(`/books?q=${encodeURIComponent(query)}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-2 bg-[#eff5ef] rounded-full px-3 md:px-4 h-9 w-auto md:w-[clamp(50px,50%,600px)] min-w-0 flex-1 md:flex-initial max-w-[160px] md:max-w-none"
    >
      <Search
        size={14}
        strokeWidth={2.2}
        className="text-[#047857B3] shrink-0"
      />
      <input
        type="text"
        placeholder="Search..."
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        className="bg-transparent border-none outline-none text-[13px] text-[#2b352f] placeholder:text-[#aab4ad] w-full hidden md:inline"
      />
    </form>
  );
}
