import Link from 'next/link';

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
    const response = await fetch(`${apiBase}/books?page=1&limit=100`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Best seller request failed:', response.status, response.statusText);
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
          cover: primaryCover || fallbackCover || 'https://via.placeholder.com/300x450?text=No+Cover',
          publisher: book.publisher || 'Independent',
          originalPrice: Number(book.originalPrice) || 0,
          quantity: Number(book.quantity) || 0,
          estimatedRevenue: (Number(book.originalPrice) || 0) * (Number(book.quantity) || 0),
        };
      })
      .sort((a, b) => b.estimatedRevenue - a.estimatedRevenue)
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
  const podiumBooks = books.slice(0, 3);
  const rankedBooks = books.slice(3);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f7faf5] px-6 py-20 md:px-12 lg:px-20">
      <div className="pointer-events-none absolute -top-28 -left-24 h-80 w-80 rounded-full bg-[#84c19f]/25 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#ffd37d]/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#4f6f5e]">Bookify picks</p>
            <h1 className="bg-gradient-to-r from-[#1a3d2b] via-[#2d6a4f] to-[#4f9b73] bg-clip-text text-4xl font-black text-transparent md:text-6xl">
              Best Sellers
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-[#5b6f63] md:text-base">
              Discover the books leading this week&apos;s chart, ranked by estimated revenue (original price × inventory).
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center gap-2 rounded-full border border-[#2d6a4f]/20 bg-white/85 px-6 py-3 text-sm font-semibold text-[#2d6a4f] shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            Explore all books →
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="rounded-3xl border border-white/60 bg-white/80 p-16 text-center shadow-xl backdrop-blur">
            <p className="text-lg text-[#58615b]">No ranking data is available yet. Please check back soon.</p>
          </div>
        ) : (
          <>
            <div className="mb-10 grid gap-5 md:grid-cols-3">
              {podiumBooks.map((book, index) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="group relative overflow-hidden rounded-3xl border border-[#dcebdd] bg-gradient-to-b from-white to-[#f4faf5] p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <span className="absolute top-4 right-4 rounded-full bg-[#2d6a4f] px-3 py-1 text-xs font-bold text-white">
                    #{index + 1}
                  </span>
                  <div className="flex gap-4">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-28 w-20 rounded-xl object-cover shadow-md transition-transform group-hover:scale-105"
                    />
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.12em] text-[#5b6f63]">{book.publisher}</p>
                      <h2 className="mt-1 line-clamp-2 text-lg font-extrabold text-[#1a3d2b]">{book.title}</h2>
                      <p className="mt-1 line-clamp-1 text-sm text-[#5b6f63]">{book.author}</p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#6f8679]">Estimated revenue</p>
                      <p className="text-xl font-black text-[#2d6a4f]">{formatVnd(book.estimatedRevenue)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="overflow-hidden rounded-3xl border border-[#e0ece1] bg-white/95 shadow-xl backdrop-blur">
              <div className="grid grid-cols-12 border-b border-[#e7efe8] bg-[#f3f8f4] px-6 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#5c6e63]">
                <span className="col-span-1">#</span>
                <span className="col-span-6">Book</span>
                <span className="col-span-2 text-right">Price</span>
                <span className="col-span-1 text-right">Stock</span>
                <span className="col-span-2 text-right">Revenue</span>
              </div>

              {rankedBooks.map((book, index) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="grid grid-cols-12 items-center gap-4 border-b border-[#eef3ef] px-6 py-4 transition-colors hover:bg-[#f8fcf9]"
                >
                  <span className="col-span-1 text-lg font-black text-[#2d6a4f]">{index + 4}</span>

                  <div className="col-span-6 flex items-center gap-4">
                    <img src={book.cover} alt={book.title} className="h-16 w-11 rounded-md object-cover" />
                    <div className="min-w-0">
                      <h3 className="line-clamp-1 font-bold text-[#1a3d2b]">{book.title}</h3>
                      <p className="line-clamp-1 text-sm text-[#5b6f63]">{book.author}</p>
                    </div>
                  </div>

                  <span className="col-span-2 text-right font-semibold text-[#1a3d2b]">{formatVnd(book.originalPrice)}</span>
                  <span className="col-span-1 text-right font-semibold text-[#1a3d2b]">{book.quantity}</span>
                  <span className="col-span-2 text-right font-black text-[#2d6a4f]">{formatVnd(book.estimatedRevenue)}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
