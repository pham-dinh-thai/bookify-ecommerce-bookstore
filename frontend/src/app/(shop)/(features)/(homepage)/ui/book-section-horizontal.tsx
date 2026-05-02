'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Book = {
  id: number;
  title: string;
  author: string;
  price: string;
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
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const visible = 5;

  const prev = () => setStart((s) => Math.max(0, s - 1));
  const next = () => setStart((s) => Math.min(books.length - visible, s + 1));

  const visibleBooks = books.slice(start, start + visible);

  return (
    <section className="relative py-20 px-8 md:px-16 lg:px-24 bg-[#1a3d2b] overflow-hidden">
      <div className="max-w-8xl mx-auto relative">
        <div className="flex items-end justify-between mb-12">
          <div>
            {label && (
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-white mb-4 block">
                {label}
              </span>
            )}
            <h2 className="text-4xl font-black text-white tracking-tight">
              {title}
            </h2>
          </div>

          <Link
            href={viewAllHref}
            className="text-white hover:text-black font-semibold flex items-center gap-2 hover:opacity-80 transition-opacity group"
          >
            View More
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {visibleBooks.map((book, index) => (
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
                >
                  <button className="w-full py-2.5 rounded-xl bg-white text-[#1a3d2b] font-bold text-xs tracking-wide hover:bg-[#c1ecd4] transition-colors">
                    View Details
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-1 mb-0.5">
                {book.title}
              </h3>
              <p className="text-xs text-[#c1ecd4]/70 mb-1">{book.author}</p>
              <h3 className="text-md font-black text-[#c1ecd4]">
                {book.price}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
