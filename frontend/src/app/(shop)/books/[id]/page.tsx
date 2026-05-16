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
    <section className="min-h-screen bg-[#f7faf5] py-20 px-8 md:px-16 lg:px-24">
      <div className="max-w-8xl mx-auto grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full rounded-[1.75rem] object-cover"
          />
          <div className="mt-8 space-y-4 text-[#1a3d2b]">
            <h1 className="text-4xl font-black tracking-tight">{book.title}</h1>
            <p className="text-sm uppercase tracking-[0.3em] text-[#58615b]">
              {book.authors}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-[#58615b]">
              <span>Publisher: {book.publisher}</span>
              <span>Pages: {book.pageCount}</span>
              <span>
                Stock: {book.isInStock ? 'Available' : 'Out of Stock'}
              </span>
            </div>
            <p className="text-2xl font-black text-[#2d6a4f]">{book.price}</p>
            <p className="text-base leading-relaxed text-[#58615b]">
              {book.description}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-xl font-black text-[#1a3d2b] mb-4">
              Product details
            </h2>
            <div className="space-y-3 text-sm text-[#58615b]">
              <div className="flex justify-between border-b border-[#e8ede9] pb-3">
                <span>ISBN</span>
                <span>{book.isbn}</span>
              </div>
              <div className="flex justify-between border-b border-[#e8ede9] pb-3">
                <span>Quantity</span>
                <span>{book.quantity}</span>
              </div>
              <div className="flex justify-between border-b border-[#e8ede9] pb-3">
                <span>Page count</span>
                <span>{book.pageCount}</span>
              </div>
              <div className="flex justify-between pt-3">
                <span>Status</span>
                <span
                  className={
                    book.isInStock ? 'text-[#2d6a4f]' : 'text-[#d6336c]'
                  }
                >
                  {book.isInStock ? 'In stock' : 'Out of stock'}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/books"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#2d6a4f] px-6 py-4 text-sm font-bold text-white hover:bg-[#1a3d2b] transition-colors"
          >
            Back to all books
          </Link>
        </div>
      </div>
    </section>
  );
}
