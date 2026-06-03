import Link from 'next/link';
import {
  BookPurchaseProvider,
  PriceAndQuantity,
  PurchaseButtons,
} from './book-purchase-actions';
import { BookSection } from '../../(features)/(homepage)/components/book-section';

type ApiBookDetail = {
  id: string;
  isbn: string;
  title: string;
  description?: string;
  authors?: string[];
  publisher?: string;
  originalPrice: number;
  discountPercentage?: number;
  quantity?: number;
  pageCount?: number;
  isInStock?: boolean;
  covers?: { url: string; isPrimary: boolean }[];
  genres?: string[];
  language?: string;
};

type ApiBookListItem = {
  id?: string;
  _id?: string;
  title: string;
  authors?: string[];
  originalPrice: number;
  discountPercentage?: number;
  covers?: { url: string; isPrimary: boolean }[];
  publisher?: string;
};

type BookDetail = {
  id: string;
  isbn: string;
  title: string;
  description?: string;
  authors: string;
  publisher?: string;
  price: string;
  originalPriceLabel?: string;
  discountPercentage: number;
  originalPrice: number;
  currentPrice: number;
  quantity: number;
  pageCount: number;
  isInStock: boolean;
  cover: string;
  genres: string;
  language: string;
};

type BookCard = {
  id: string;
  title: string;
  author: string;
  price: string;
  originalPrice?: string;
  discountPercentage?: number;
  cover: string;
  publisher?: string;
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

function getDiscountedPrice(originalPrice: number, discountPercentage: number) {
  return Math.max(0, originalPrice * (1 - discountPercentage / 100));
}

async function getBookDetail(id: string): Promise<BookDetail | null> {
  try {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/books/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const responseBody = await response.text();
    if (!responseBody.trim()) return null;

    const rawData = JSON.parse(responseBody);
    const data: ApiBookDetail = rawData?.book ?? rawData;
    if (!data || !data.id) return null;

    const primaryCover = data.covers?.find((cover) => cover.isPrimary)?.url;
    const fallbackCover = data.covers?.[0]?.url;
    const originalPrice = Number(data.originalPrice) || 0;
    const discountPercentage = Number(data.discountPercentage || 0);
    const currentPrice =
      discountPercentage > 0
        ? getDiscountedPrice(originalPrice, discountPercentage)
        : originalPrice;

    return {
      id: data.id,
      isbn: data.isbn,
      title: data.title,
      description: data.description || 'No description available.',
      authors: data.authors?.join(', ') || 'Unknown author',
      publisher: data.publisher || 'Unknown publisher',
      price: formatVnd(currentPrice),
      originalPriceLabel:
        discountPercentage > 0 ? formatVnd(originalPrice) : undefined,
      discountPercentage,
      originalPrice,
      currentPrice,
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

async function getRelatedBooks(excludeId: string): Promise<BookCard[]> {
  try {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/books?page=1&limit=10`, {
      cache: 'no-store',
    });

    if (!response.ok) return [];

    const data = await response.json();
    const list: ApiBookListItem[] = Array.isArray(data?.books)
      ? data.books
      : [];

    return list
      .filter((b) => (b.id ?? b._id) !== excludeId)
      .map((b) => {
        const primaryCover = b.covers?.find((c) => c.isPrimary)?.url;
        const fallbackCover = b.covers?.[0]?.url;
        const originalPrice = Number(b.originalPrice) || 0;
        const discountPercentage = Number(b.discountPercentage || 0);
        const hasDiscount = discountPercentage > 0;
        const price = hasDiscount
          ? getDiscountedPrice(originalPrice, discountPercentage)
          : originalPrice;

        return {
          id: b.id ?? b._id ?? '',
          title: b.title,
          author: b.authors?.join(', ') || 'Unknown author',
          price: formatVnd(price),
          originalPrice: hasDiscount ? formatVnd(originalPrice) : undefined,
          discountPercentage: hasDiscount ? discountPercentage : undefined,
          cover:
            primaryCover ||
            fallbackCover ||
            'https://via.placeholder.com/400x550?text=No+Cover',
          publisher: b.publisher,
        };
      });
  } catch (error) {
    console.error('Failed to fetch related books:', error);
    return [];
  }
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [book, relatedBooks] = await Promise.all([
    getBookDetail(id),
    getRelatedBooks(id),
  ]);

  if (!book) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#f7faf5] px-8">
        <div className="rounded-2xl bg-white p-10 text-center shadow-xl">
          <h1 className="mb-3 text-2xl font-bold text-[#1a3d2b]">
            Book not found
          </h1>
          <p className="mb-6 text-[#58615b]">
            We couldn&apos;t find the book you&apos;re looking for.
          </p>
          <Link
            href="/books"
            className="inline-flex items-center justify-center rounded-full bg-[#2d6a4f] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a3d2b]"
          >
            Back to books
          </Link>
        </div>
      </section>
    );
  }

  return (
    <BookPurchaseProvider stock={book.quantity} isInStock={book.isInStock}>
      {/* Main detail section */}
      <section className="bg-[#f7faf5] px-5 pb-12 pt-8 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left column: cover + buttons + shipping */}
            <div className="space-y-5 lg:col-span-5 lg:top-20">
              <div className="overflow-hidden bg-white shadow-[0px_18px_36px_rgba(43,53,47,0.18)]">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-[560px] w-full object-cover object-center transition-transform duration-700 hover:scale-105 md:h-[640px]"
                />
              </div>

              <div className="grid gap-3 rounded-xl border border-[#aab4ad]/30 bg-[#e8f0e9] p-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-bold text-[#2b352f]">
                    Shipping Information
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-[#58615b]">
                    Standard delivery: 3-5 business days.
                  </p>
                  <p className="text-xs font-semibold text-[#3f6754]">
                    Free for orders over 500.000 VNĐ
                  </p>
                </div>
                <div className="border-t border-[#aab4ad]/30 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                  <p className="text-sm font-bold text-[#2b352f]">
                    Collector&apos;s Guarantee
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-[#58615b]">
                    Archival-grade packaging. Authenticity certificate included.
                  </p>
                </div>
              </div>
            </div>

            {/* Right column: title + price/qty + specs + description */}
            <div className="space-y-6 lg:col-span-7">
              <header className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3f6754]">
                    Rare Limited Collection
                  </span>
                  <h1 className="text-4xl font-extrabold leading-snug tracking-tight text-[#2b352f] md:text-[2.75rem]">
                    {book.title}
                  </h1>
                </div>
              </header>

              <section className="rounded-xl bg-[#eff5ef] p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#737d76]">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
                  <Meta label="Author" value={book.authors} />
                  <Meta
                    label="Publisher"
                    value={book.publisher || 'Unknown publisher'}
                  />
                  <Meta label="Genre" value={book.genres} />
                  <Meta label="Language" value={book.language} />
                  <Meta label="ISBN" value={book.isbn} />
                  <Meta label="Pages" value={String(book.pageCount)} />
                </div>
              </section>


              <section className="rounded-xl border border-[#d4dfd7] bg-white p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#737d76]">
                  Book Details
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Meta label="Price" value={book.price} />
                  {book.originalPriceLabel && (
                    <Meta
                      label="Original Price"
                      value={`${book.originalPriceLabel} (-${book.discountPercentage}%)`}
                    />
                  )}
                  <Meta
                    label="Quantity"
                    value={`${book.quantity} ${book.quantity === 1 ? 'copy' : 'copies'} available`}
                  />
                </div>
              </section>

              <PriceAndQuantity price={book.price} />

              <PurchaseButtons
                book={{
                  id: book.id,
                  title: book.title,
                  author: book.authors,
                  edition: book.publisher || 'Unknown publisher',
                  price: book.currentPrice,
                  stock: book.quantity,
                  cover: book.cover,
                  isAvailable: book.isInStock && book.quantity > 0,
                }}
              />

              <section className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#737d76]">
                  Book Description
                </h3>
                <p className="whitespace-pre-line text-base font-medium leading-relaxed text-[#58615b]">
                  {book.description}
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* Related books section */}
      {relatedBooks.length > 0 && (
        <BookSection
          label="You May Also Like"
          title="More From the Collection"
          books={relatedBooks}
          visible={5}
          viewAllHref="/books"
        />
      )}
    </BookPurchaseProvider>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#8b948f]">
        {label}
      </span>
      <p className="text-sm font-semibold text-[#2b352f]">{value}</p>
    </div>
  );
}
