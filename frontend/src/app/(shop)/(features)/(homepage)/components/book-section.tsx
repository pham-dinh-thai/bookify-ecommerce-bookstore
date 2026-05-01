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

export function BookSection({
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
    <section className="relative py-20 px-8 md:px-16 lg:px-24 bg-[#f7faf5] overflow-hidden">
      <div className="max-w-8xl mx-auto relative">
        <div className="flex items-end justify-between mb-12">
          <div>
            {label && (
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-px bg-[#2d6a4f]" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#2d6a4f] font-bold">
                  {label}
                </p>
              </div>
            )}
            <h2 className="text-4xl font-black text-[#1a3d2b] tracking-tight">
              {title}
            </h2>
          </div>

          <Link
            href={viewAllHref}
            className="flex items-center gap-2 text-sm font-bold text-[#2d6a4f] hover:text-[#1a3d2b] transition-colors group"
          >
            View more
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
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
                {/* Book cover */}
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

                {/* Hover overlay */}
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

                {/* Edition badge */}
                {book.edition && (
                  <div className="absolute top-3 left-3">
                    <span className="text-[8px] font-black tracking-widest uppercase bg-white/90 backdrop-blur-sm text-[#2d6a4f] px-2 py-1 rounded-md">
                      {book.edition}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="px-1">
                <h3
                  className="text-md font-bold text-[#1a3d2b] leading-tight mb-0.5 line-clamp-1 transition-colors duration-200"
                  style={{
                    color: hoveredId === book.id ? '#2d6a4f' : '#1a3d2b',
                  }}
                >
                  {book.title}
                </h3>
                <p className="text-xs text-[#58615b] mb-1 line-clamp-1">
                  {book.author}
                </p>
                <p className="text-sm font-black text-[#2d6a4f]">
                  {book.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
