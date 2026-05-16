import Link from 'next/link';
import BookPurchaseActions from './book-purchase-actions';

type ApiBookDetail = {
  id: string;
  isbn: string;
  title: string;
  description?: string;
  authors?: string[];
  publisher?: string;
  originalPrice: number;
  quantity?: number;
  pageCount?: number;
  isInStock?: boolean;
  covers?: { url: string; isPrimary: boolean }[];
  genres?: string[];
  language?: string;
};

type BookDetail = {
  id: string;
  isbn: string;
  title: string;
  description?: string;
  authors: string;
  publisher?: string;
  price: string;
  quantity: number;
  pageCount: number;
  isInStock: boolean;
  cover: string;
  genres: string;
  language: string;
};

function getApiBaseUrl(): string {
  const internalUrl = process.env.API_INTERNAL_URL;
  const publicUrl = process.env.NEXT_PUBLIC_API_URL;

  if (internalUrl) return internalUrl.replace(/\/$/, '');
  if (publicUrl) return publicUrl.replace(/\/$/, '');
  return '/api';
}

function formatVnd(value: number) {
  return `${Number(value).toLocaleString('vi-VN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} VNĐ`;
}

async function getBookDetail(id: string): Promise<BookDetail | null> {
  try {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/books/${id}`, { cache: 'no-store' });

    if (!response.ok) return null;

    const responseBody = await response.text();
    if (!responseBody.trim()) return null;

    const rawData = JSON.parse(responseBody);
    const data: ApiBookDetail = rawData?.book ?? rawData;
    if (!data || !data.id) return null;

    const primaryCover = data.covers?.find((cover) => cover.isPrimary)?.url;
    const fallbackCover = data.covers?.[0]?.url;

    return {
      id: data.id,
      isbn: data.isbn,
      title: data.title,
      description: data.description || 'No description available.',
      authors: data.authors?.join(', ') || 'Unknown author',
      publisher: data.publisher || 'Unknown publisher',
      price: formatVnd(data.originalPrice),
      quantity: data.quantity ?? 0,
      pageCount: data.pageCount ?? 0,
      isInStock: data.isInStock ?? false,
      genres: data.genres?.join(', ') || 'Updating',
      language: data.language || 'Unknown language',
      cover:
        primaryCover ||
        fallbackCover ||
        'https://via.placeholder.com/400x550?text=No+Cover',
    };
  } catch (error) {
    console.error('Failed to fetch book detail:', error);
    return null;
  }
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBookDetail(id);

  if (!book) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#f7faf5] px-8 md:px-16 lg:px-24">
        <div className="rounded-3xl bg-white p-12 text-center shadow-xl">
          <h1 className="mb-4 text-3xl font-bold text-[#1a3d2b]">Book not found</h1>
          <p className="mb-8 text-[#58615b]">We couldn&apos;t find the book you&apos;re looking for.</p>
          <Link
            href="/books"
            className="inline-flex items-center justify-center rounded-full bg-[#2d6a4f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a3d2b]"
          >
            Back to books
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f7faf5] px-6 pb-24 pt-12 md:px-12">
      <div className="mx-auto max-w-7xl space-y-16">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12 lg:gap-24">
          <div className="space-y-8 lg:col-span-5 lg:sticky lg:top-24">
            <div className="aspect-[3/4] overflow-hidden rounded-xl bg-[#eff5ef] p-8">
              <div className="h-full w-full overflow-hidden rounded-lg shadow-[0px_20px_40px_rgba(43,53,47,0.06)]">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
            <BookPurchaseActions stock={book.quantity} isInStock={book.isInStock} />
          </div>

          <div className="space-y-10 lg:col-span-7">
            <header className="space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3f6754]">Rare Limited Collection</span>
                <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.08] tracking-tight text-[#2b352f] md:text-6xl">
                  {book.title}
                </h1>
              </div>

              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="rounded-xl border border-[#c1ecd4]/50 bg-[#c1ecd4]/30 px-6 py-3 text-4xl font-extrabold tracking-tight text-[#1B4332]">
                    {book.price}
                  </div>
                  <div className="text-sm font-medium text-[#58615b]">
                    <span className="font-bold text-[#3f6754]">{book.quantity}</span> copies available in archive
                  </div>
                </div>

                <div className="grid gap-4 rounded-xl border border-[#aab4ad]/30 bg-[#e8f0e9] p-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-bold text-[#2b352f]">Shipping Information</p>
                    <p className="text-xs leading-snug text-[#58615b]">Standard delivery: 3-5 business days.</p>
                    <p className="text-xs font-semibold text-[#3f6754]">Free for orders over 500.000 VNĐ</p>
                  </div>
                  <div className="border-t border-[#aab4ad]/30 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                    <p className="text-sm font-bold text-[#2b352f]">Collector&apos;s Guarantee</p>
                    <p className="text-xs leading-snug text-[#58615b]">Archival-grade packaging. Authenticity certificate included.</p>
                  </div>
                </div>
              </div>
            </header>

            <section className="rounded-xl bg-[#eff5ef] p-8">
              <h3 className="mb-6 text-[10px] font-bold uppercase tracking-[0.15em] text-[#737d76]">Technical Specifications</h3>
              <div className="grid grid-cols-1 gap-x-12 gap-y-7 sm:grid-cols-2">
                <Meta label="Author" value={book.authors} />
                <Meta label="Publisher" value={book.publisher || 'Unknown publisher'} />
                <Meta label="Genre" value={book.genres} />
                <Meta label="Language" value={book.language} />
                <Meta label="ISBN" value={book.isbn} />
                <Meta label="Pages" value={String(book.pageCount)} />
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737d76]">The Narrative</h3>
              <p className="text-lg font-medium leading-relaxed text-[#58615b]">{book.description}</p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#8b948f]">{label}</span>
      <p className="text-base font-semibold text-[#2b352f]">{value}</p>
    </div>
  );
}
