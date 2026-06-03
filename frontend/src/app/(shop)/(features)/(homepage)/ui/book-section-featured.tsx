'use client';

import { ArrowRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

type Book = {
  id: string;
  title: string;
  author: string;
  price: string;
  originalPrice?: string;
  discountPercentage?: number;
  cover: string;
  publisher?: string;
  description?: string;
};

type Props = {
  label?: string;
  title: string;
  books: Book[];
  viewAllHref?: string;
};

export function BookSectionHighlight({
  label,
  title,
  books,
  viewAllHref = '/best-seller',
}: Props) {
  const featured = books[0];
  const rest = books.slice(1, 4);

  return (
    <section className="max-w-8xl mx-auto px-8 md:px-16 lg:px-24 py-20 mb-8">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          {label && (
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#58615b] mb-4 block">
              {label}
            </span>
          )}
          <h2 className="text-4xl font-bold tracking-tight text-[#1a3d2b]">
            {title}
          </h2>
        </div>
        <Link
          href={viewAllHref}
          className="text-[#2d6a4f] font-semibold flex items-center gap-2 hover:opacity-80 transition-opacity group"
        >
          View More
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Large Feature Highlight */}
        <Link
          href={`/books/${featured.id}`}
          className="lg:col-span-7 bg-[#eff5ef] rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10 items-center group cursor-pointer hover:bg-[#e8f0e9] transition-colors duration-500"
        >
          <div className="w-full md:w-1/2 aspect-[2/3] overflow-hidden shadow-2xl transition-transform">
            <img
              src={featured.cover}
              alt={featured.title}
              className="w-full h-full bg-white"
            />
          </div>
          <div className="w-full md:w-1/2">
            {featured.publisher ? (
              <span className="text-[10px] font-bold text-[#58615b] uppercase tracking-widest block mb-4">
                {featured.publisher}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-[#58615b] uppercase tracking-widest block mb-4">
                Penguin Classics
              </span>
            )}
            <h3 className="text-3xl font-bold mb-4 leading-tight text-[#1a3d2b]">
              {featured.title}
            </h3>
            {featured.description ? (
              <p className="text-[#58615b] leading-relaxed mb-8 text-sm line-clamp-3 ">
                {featured.description}
              </p>
            ) : (
              <p className="text-[#58615b] leading-relaxed mb-8 text-sm line-clamp-3 ">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Voluptate sed magni quaerat minima, hic reiciendis nemo
                reprehenderit animi voluptatem ad qui iusto quas magnam rem iste
                perferendis, voluptas sit. Optio!
              </p>
            )}
            <br />
            <br />

            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-[#2d6a4f]">
                {featured.price}
              </span>
              {featured.originalPrice && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#8b948f] line-through">
                    {featured.originalPrice}
                  </span>
                  {featured.discountPercentage ? (
                    <span className="rounded-full bg-[#fff3e8] px-2 py-0.5 font-bold text-[#9a5524]">
                      -{featured.discountPercentage}%
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* Vertical List */}
        <div className="lg:col-span-5 space-y-2 flex flex-col justify-center">
          {rest.map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="flex gap-6 p-4 rounded-3xl hover:bg-[#eff5ef] transition-colors group cursor-pointer"
            >
              <div className="w-20 aspect-[2/3]  overflow-hidden shadow-md shrink-0">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-contain bg-white"
                />
              </div>
              <div className="min-w-0">
                {book.publisher ? (
                  <span className="text-[10px] font-bold text-[#58615b] uppercase tracking-widest block mb-1">
                    {book.publisher}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#58615b] uppercase tracking-widest block mb-1">
                    Penguin Classics
                  </span>
                )}
                <h4 className="font-bold text-lg mb-1 text-[#1a3d2b] group-hover:text-[#2d6a4f] transition-colors line-clamp-1">
                  {book.title}
                </h4>
                {book.description ? (
                  <p className="text-sm text-[#58615b] line-clamp-2">
                    {book.description}
                  </p>
                ) : (
                  <p className="text-sm text-[#58615b] line-clamp-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Accusantium quod adipisci aspernatur sequi, in natus
                    reprehenderit. Saepe magni cupiditate, aut, pariatur
                    accusamus, distinctio nobis eveniet sunt voluptates ipsa ea
                    mollitia.
                  </p>
                )}
                <div className="mt-1 flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-[#2d6a4f]">
                    {book.price}
                  </span>
                  {book.originalPrice && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="text-[#8b948f] line-through">
                        {book.originalPrice}
                      </span>
                      {book.discountPercentage ? (
                        <span className="rounded-full bg-[#fff3e8] px-1.5 py-0.5 font-bold text-[#9a5524]">
                          -{book.discountPercentage}%
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
