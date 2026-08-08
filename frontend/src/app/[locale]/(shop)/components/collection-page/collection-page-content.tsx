'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import Paginate from '@/shared/common/components/pagination/paginate';

type ApiBook = {
  id?: string;
  _id?: string;
  title: string;
  originalPrice: number;
  salePrice?: number;
  currentPrice?: number;
  discountPercentage?: number;
  isOnSale?: boolean;
  isNewArrival?: boolean;
  genres?: string[];
  authors?: string[];
  covers?: { url: string; isPrimary: boolean }[];
};

function formatCurrency(amount: number): string {
  return `${Number(amount || 0).toLocaleString('vi-VN')} VNĐ`;
}

function getDiscountedPrice(originalPrice: number, discountPercentage: number) {
  return Math.max(0, originalPrice * (1 - discountPercentage / 100));
}

export default function CollectionPageContent({
  books,
  total,
  page,
  pageSize,
  pageHrefPrefix,
}: {
  books: ApiBook[];
  total: number;
  page: number;
  pageSize: number;
  pageHrefPrefix: string;
}) {
  const router = useRouter();

  const handlePageChange = (nextPage: number) => {
    router.push(`${pageHrefPrefix}${nextPage}`);
  };

  return (
    <div className="flex-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-10 gap-4 ">
        <p className="text-sm font-medium text-on-surface-variant">
          Showing{' '}
          <span className="text-on-surface font-bold">
            {books.length}
          </span>{' '}
          of{' '}
          <span className="text-on-surface font-bold">
            {total}
          </span>{' '}
          volumes
        </p>
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="flex items-center gap-2 group cursor-pointer"
            aria-label="Sort books by newest"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant group-hover:text-primary transition-colors">
              Sort: Newest
            </span>
            <ChevronDown
              size={16}
              className="text-on-surface-variant group-hover:text-primary transition-colors"
            />
          </button>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-10 text-center">
          <p className="text-on-surface-variant">
            No books found for this collection.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12">
            {books.map((book) => {
              const primaryCover = book.covers?.find(
                (cover) => cover.isPrimary,
              )?.url;
              const fallbackCover = book.covers?.[0]?.url;
              const bookId = book.id || book._id;
              const originalPrice = Number(book.originalPrice || 0);
              const discountPercentage = Number(
                book.discountPercentage || 0,
              );
              const hasDiscount = Boolean(
                book.isOnSale ?? discountPercentage > 0,
              );
              const displayPrice =
                book.salePrice ??
                (book.currentPrice !== undefined &&
                book.currentPrice !== null
                  ? Number(book.currentPrice)
                  : hasDiscount
                    ? getDiscountedPrice(
                        originalPrice,
                        discountPercentage,
                      )
                    : originalPrice);

              if (!bookId) return null;

              return (
                <Link
                  key={bookId}
                  href={`/books/${bookId}`}
                  className="group min-w-0"
                >
                  <div className="bg-surface-container-lowest transition-all duration-500 group-hover:-translate-y-2 shadow-[0px_20px_40px_rgba(43,53,47,0.04)] overflow-hidden relative aspect-[3/4]">
                    <img
                      alt={`${book.title} cover`}
                      className="w-full h-full object-cover"
                      src={
                        primaryCover ||
                        fallbackCover ||
                        'https://via.placeholder.com/300x450?text=No+Cover'
                      }
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  </div>
                  <div className="mt-4 min-w-0">
                    <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant block mb-1 truncate">
                      {(book.genres && book.genres[0]) || 'Collection'}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors leading-tight truncate">
                      {book.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-on-surface-variant mb-2 truncate">
                      {book.authors?.join(', ') || 'Unknown author'}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      <span className="block text-sm font-bold text-on-surface truncate">
                        {formatCurrency(displayPrice)}
                      </span>
                      {hasDiscount && (
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="text-on-surface-variant line-through">
                            {formatCurrency(originalPrice)}
                          </span>
                          <span className="rounded-full bg-[#fff3e8] px-1.5 py-0.5 font-bold text-[#9a5524]">
                            -{discountPercentage}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 md:mt-20 flex justify-center items-center gap-4">
            <Paginate
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={handlePageChange}
              showTotal={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
