import Link from 'next/link';

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
};

function getApiBaseUrl(): string {
  const internalUrl = process.env.API_INTERNAL_URL;
  const publicUrl = process.env.NEXT_PUBLIC_API_URL;

  if (internalUrl) {
    return internalUrl.replace(/\/$/, '');
  }

  if (publicUrl) {
    return publicUrl.replace(/\/$/, '');
  }

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
    const response = await fetch(`${apiBase}/books/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const responseBody = await response.text();
    if (!responseBody.trim()) {
      return null;
    }

    const rawData = JSON.parse(responseBody);
    const data: ApiBookDetail = rawData?.book ?? rawData;

    if (!data || !data.id) {
      return null;
    }

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
      <section className="min-h-screen bg-[#f7faf5] flex items-center justify-center px-8 md:px-16 lg:px-24">
        <div className="rounded-3xl bg-white p-12 shadow-xl text-center">
          <h1 className="text-3xl font-bold text-[#1a3d2b] mb-4">
            Book not found
          </h1>
          <p className="text-[#58615b] mb-8">
            We couldn&apos;t find the book you&apos;re looking for.
          </p>
          <Link
            href="/books"
            className="inline-flex items-center justify-center rounded-full bg-[#2d6a4f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1a3d2b] transition-colors"
          >
            Back to books
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f7faf5] px-6 pb-24 pt-14 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-[#eff5ef] p-10 shadow-[0px_20px_40px_rgba(43,53,47,0.06)]">
              <img
                src={book.cover}
                alt={book.title}
                className="h-full w-full object-contain shadow-2xl transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          <div className="flex flex-col gap-10 lg:col-span-7">
            <header className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#c1ecd4] px-3 py-1 text-xs font-bold uppercase tracking-[0.05em] text-[#325947]">
                  New Arrival
                </span>
                <span className="rounded-full bg-[#e8f0e9] px-3 py-1 text-xs font-bold uppercase tracking-[0.05em] text-[#58615b]">
                  {book.publisher}
                </span>
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-[-0.02em] text-[#2b352f] md:text-5xl lg:text-6xl">
                {book.title}
              </h1>
              <p className="text-xl font-medium italic text-[#3f6754]">
                by {book.authors}
              </p>
            </header>

            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-[#2b352f]">
                {book.price}
              </span>
            </div>

            <div className="flex flex-col gap-6">
              <p className="max-w-2xl text-lg leading-relaxed text-[#58615b]">
                {book.description}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button className="rounded-xl bg-[#3f6754] px-8 py-4 text-lg font-bold text-[#e6ffef] transition-all hover:bg-[#335b48] active:scale-95">
                  Add to Cart
                </button>
                <Link
                  href="/books"
                  className="rounded-xl bg-[#e2eae3] px-8 py-4 text-lg font-bold text-[#2b352f] transition-all hover:bg-[#dbe5dd] active:scale-95"
                >
                  Back to Books
                </Link>
              </div>
            </div>

            <section className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="flex flex-col gap-1 rounded-xl bg-[#eff5ef] p-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#58615b]">
                  ISBN-13
                </span>
                <span className="text-sm font-semibold text-[#2b352f]">
                  {book.isbn}
                </span>
              </div>
              <div className="flex flex-col gap-1 rounded-xl bg-[#eff5ef] p-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#58615b]">
                  Pages
                </span>
                <span className="text-sm font-semibold text-[#2b352f]">
                  {book.pageCount}
                </span>
              </div>
              <div className="flex flex-col gap-1 rounded-xl bg-[#eff5ef] p-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#58615b]">
                  Quantity
                </span>
                <span className="text-sm font-semibold text-[#2b352f]">
                  {book.quantity}
                </span>
              </div>
              <div className="flex flex-col gap-1 rounded-xl bg-[#eff5ef] p-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#58615b]">
                  Stock
                </span>
                <span className="text-sm font-semibold text-[#2b352f]">
                  {book.isInStock ? 'In stock' : 'Out of stock'}
                </span>
              </div>
            </section>
          </div>
        </div>

        <section className="mt-24 grid grid-cols-1 gap-14 lg:grid-cols-3">
          <div>
            <h2 className="mb-5 text-3xl font-bold tracking-tight text-[#2b352f]">
              Book Overview
            </h2>
            <p className="mb-6 leading-relaxed text-[#58615b]">
              A curated edition for readers who value both content and
              aesthetics. This detail view focuses on readability, core metadata,
              and a premium presentation inspired by modern editorial storefronts.
            </p>
            <p className="font-semibold text-[#3f6754]">✓ Carefully curated title</p>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-[#aab4ad]/20 bg-white p-8">
              <h3 className="mb-5 text-xl font-bold text-[#2b352f]">
                Shipping &amp; Care
              </h3>
              <ul className="space-y-4 text-[#58615b]">
                <li>• Packed securely to avoid bent corners.</li>
                <li>• Delivery time depends on your location and stock status.</li>
                <li>• Keep books in dry spaces away from direct sunlight.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-[#2b352f]">
                Reader Reflections
              </h2>
              <p className="mt-2 font-semibold text-[#3f6754]">
                ★★★★★ 4.9 / 5.0
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
