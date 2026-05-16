'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

type Book = {
  id: string;
  title: string;
  author: string;
  price: string;
  cover: string;
  description?: string;
};

type Props = {
  label?: string;
  title: string;
  books: Book[];
  viewAllHref?: string;
};

export function BookSectionBestSeller({
  label,
  title,
  books,
  viewAllHref = '/books',
}: Props) {
  const [first, ...rest] = books;

  if (!first) {
    return null;
  }

  return (
    <section className="max-w-8xl mx-auto px-8 md:px-16 lg:px-24 py-20 mb-8">
      <div className="text-center mb-16">
        {label && (
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#58615b] mb-4 block">
            {label}
          </span>
        )}
        <h2 className="text-4xl font-black tracking-tight text-[#1a3d2b] mb-4">
          Current {title}
        </h2>
        <div className="h-1 w-20 bg-[#2d6a4f] mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Rank #1 */}
        <Link
          href={`/books/${first.id}`}
          className="md:col-span-6 lg:col-span-5 group cursor-pointer relative"
        >
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#2d6a4f] text-white rounded-full flex items-center justify-center font-black text-3xl shadow-xl z-20 border-4 border-[#f7faf5]">
            1
          </div>
          <div className="bg-[#eff5ef] rounded-[2.5rem] p-6 group-hover:bg-[#2d6a4f] transition-all duration-500 flex flex-row gap-5 items-center">
            <div className="w-[45%] shrink-0 aspect-[2/3] overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-95">
              <img
                src={first.cover}
                alt={first.title}
                className="w-full h-full bg-white"
              />
            </div>
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <h4 className="text-xl font-black mb-1 text-[#1a3d2b] group-hover:text-white transition-colors line-clamp-2 leading-tight">
                {first.title}
              </h4>
              <p className="text-xs text-[#58615b] group-hover:text-white/70 transition-colors mb-3">
                {first.author}
              </p>
              {first.description && (
                <p className="text-[#58615b] group-hover:text-white/80 mb-4 text-xs leading-relaxed line-clamp-3 transition-colors">
                  {first.description}
                </p>
              )}
              <div className="flex justify-between items-center mt-auto">
                <span className="text-lg font-black text-[#2d6a4f] group-hover:text-white transition-colors">
                  {first.price}
                </span>
                <ShoppingCart
                  size={20}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </Link>

        {/* Ranks #2–5 */}
        <div className="md:col-span-6 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {rest.slice(0, 4).map((book, i) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="group cursor-pointer relative pt-4"
            >
              <div className="absolute -top-2 -left-2 w-12 h-12 bg-[#dbe5dd] rounded-full flex items-center justify-center font-black text-xl shadow-md z-20 border-2 border-[#f7faf5] text-[#1a3d2b]">
                {i + 2}
              </div>
              <div className="bg-white p-4 rounded-3xl border border-[#e8ede9] hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 flex flex-row gap-4 items-center">
                <div className="w-16 shrink-0 aspect-[2/3] rounded-xl overflow-hidden shadow-md">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-contain bg-[#f7faf5]"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-black text-sm text-[#1a3d2b] group-hover:text-[#2d6a4f] transition-colors line-clamp-2 leading-tight mb-1">
                    {book.title}
                  </h5>
                  <p className="text-[10px] text-[#58615b] mb-2">
                    {book.author}
                  </p>
                  <p className="text-sm font-black text-[#2d6a4f]">
                    {book.price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
