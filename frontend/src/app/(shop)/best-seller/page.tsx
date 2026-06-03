import Link from 'next/link';
import { AddToCartButton } from './add-to-cart-button';

type ApiBook = {
  id?: string;
  _id?: string;
  title: string;
  originalPrice: number;
  quantity: number;
  authors?: string[];
  covers?: { url: string; isPrimary: boolean }[];
  publisher?: string;
};

type BestSellerBook = {
  id: string;
  title: string;
  author: string;
  cover: string;
  publisher: string;
  originalPrice: number;
  quantity: number;
  estimatedRevenue: number;
};

function getApiBaseUrl(): string {
  const internalUrl = process.env.API_INTERNAL_URL;
  const publicUrl = process.env.NEXT_PUBLIC_API_URL;

  if (internalUrl) return internalUrl.replace(/\/$/, '');
  if (publicUrl) return publicUrl.replace(/\/$/, '');

  return '/api';
}

async function getBestSellerBooks(): Promise<BestSellerBook[]> {
  try {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/best-seller?page=1&limit=10`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(
        'Best seller request failed:',
        response.status,
        response.statusText,
      );
      return [];
    }

    const data = await response.json();
    const books: ApiBook[] = Array.isArray(data?.books) ? data.books : [];

    return books
      .filter((book) => Boolean(book.id || book._id))
      .map((book) => {
        const primaryCover = book.covers?.find((cover) => cover.isPrimary)?.url;
        const fallbackCover = book.covers?.[0]?.url;

        return {
          id: book.id || book._id || '',
          title: book.title,
          author: book.authors?.join(', ') || 'Unknown author',
          cover:
            primaryCover ||
            fallbackCover ||
            'https://via.placeholder.com/300x450?text=No+Cover',
          publisher: book.publisher || 'Independent',
          originalPrice: Number(book.originalPrice) || 0,
          quantity: Number(book.quantity) || 0,
          estimatedRevenue:
            (Number(book.originalPrice) || 0) * (Number(book.quantity) || 0),
        };
      })
      .slice(0, 10);
  } catch (error) {
    console.error('Failed to fetch best seller books:', error);
    return [];
  }
}

function formatVnd(value: number) {
  return `${value.toLocaleString('vi-VN')} VNĐ`;
}

export default async function BestSellerPage() {
  const books = await getBestSellerBooks();

  return (
    <section className="bg-[#f7faf5] px-6 pt-16 pb-20 text-[#2b352f] md:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-[#1b4332]">
            Archive Vol. IV • 2024
          </p>
          <h1 className="mb-5 text-5xl font-extrabold tracking-tight md:text-7xl">
            The Best Sellers
          </h1>
          <p className="mx-auto max-w-2xl text-base font-light text-[#58615b] md:text-lg">
            A definitive ranking of our top 10 literary acquisitions. Structured
            by intellectual depth and aesthetic permanence.
          </p>
        </div>

        {books.length === 0 ? (
          <div className="rounded-xl border border-[#aab4ad]/20 bg-white p-10 text-center">
            <p className="text-[#58615b]">
              No ranking data is available yet. Please check back soon.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#aab4ad]/20">
            {books.map((book, index) => (
              <Link key={book.id} href={`/books/${book.id}`} className="block">
                <article className="group -mx-4 flex items-center gap-5 rounded-xl px-4 py-8 transition-all duration-300 hover:bg-[#1b4332]/[0.04] cursor-pointer md:gap-10 md:py-10">
                  <span className="w-16 shrink-0 text-4xl font-black tabular-nums text-[#1b4332]/15 md:w-24 md:text-6xl">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div
                    className="w-14 shrink-0 overflow-hidden bg-[#e8f0e9] shadow-sm transition-shadow group-hover:shadow-md md:w-20"
                    style={{ aspectRatio: '2/3' }}
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-bold tracking-tight text-[#2b352f] md:text-2xl">
                      {book.title}
                    </h2>
                    <p className="truncate text-sm font-light italic text-[#58615b] md:text-base">
                      {book.author}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#58615b]">
                      {book.publisher}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-base font-extrabold text-[#1b4332] md:text-lg">
                      {formatVnd(book.originalPrice)}
                    </p>
                    <AddToCartButton
                      item={{
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        edition: book.publisher,
                        price: book.originalPrice,
                        quantity: 1,
                        stock: book.quantity,
                        cover: book.cover,
                        isAvailable: book.quantity > 0,
                      }}
                    />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.2em] text-[#1b4332]"
          >
            Discover Full Vault
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
