'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

type Book = {
  id: string;
  title: string;
  author: string;
  price: string;
  originalPrice?: string;
  discountPercentage?: number;
  cover: string;
  publisher?: string;
  edition?: string;
};

type BookSectionProps = {
  label?: string;
  title: string;
  books: Book[];
  viewAllHref?: string;
};

export function BookSectionHorizontal({
  label,
  title,
  books,
  viewAllHref = '/books',
}: BookSectionProps) {
  const [start, setStart] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [visible, setVisible] = useState(5);
  const t = useTranslations('home');

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setVisible(mq.matches ? 4 : 5);
    const handler = (e: MediaQueryListEvent) => setVisible(e.matches ? 4 : 5);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const prev = () => setStart((s) => Math.max(0, s - 1));
  const next = () => setStart((s) => Math.min(books.length - visible, s + 1));

  const visibleBooks = books.slice(start, start + visible);

  return (
    <section className="relative py-12 md:py-20 px-8 md:px-16 lg:px-24 bg-[#1a3d2b] overflow-hidden">
      <div className="max-w-8xl mx-auto relative">
        <div className="flex items-end justify-between mb-12">
          <div>
            {label && (
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-white mb-4 block">
                {label}
              </span>
            )}
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {title}
            </h2>
          </div>

          <Link
            href={viewAllHref}
            className="text-white hover:text-black font-semibold flex items-center gap-2 hover:opacity-80 transition-opacity group"
          >
            {t('viewMore')}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-10">
          {visibleBooks.map((book) => (
            <div
              key={book.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredId(book.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                transform:
                  hoveredId === book.id ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <Link href={`/books/${book.id}`} className="block">
                {/* Card */}
                <div className="relative overflow-hidden mb-4">
                  <div className="aspect-[3/4] flex items-center justify-center overflow-hidden">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-full w-full object-contain transition-transform duration-700"
                      style={{
                        transform:
                          hoveredId === book.id ? 'scale(1.06)' : 'scale(1)',
                      }}
                    />
                  </div>
                  <div
                    className="absolute inset-0 flex items-end p-4 transition-opacity duration-300"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(26,61,43,0.85) 0%, transparent 50%)',
                      opacity: hoveredId === book.id ? 1 : 0,
                    }}
                  ></div>
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-1 mb-0.5">
                  {book.title}
                </h3>
                <p className="text-xs text-[#c1ecd4]/70 mb-1 line-clamp-1">
                  {book.author}
                </p>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-md font-black text-[#c1ecd4]">
                    {book.price}
                  </h3>
                  {book.originalPrice && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="text-white/45 line-through">
                        {book.originalPrice}
                      </span>
                      {book.discountPercentage ? (
                        <span className="rounded-full bg-white/10 px-1.5 py-0.5 font-bold text-[#c1ecd4]">
                          -{book.discountPercentage}%
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
