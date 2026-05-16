import Link from 'next/link';

type ApiBook = {
  id?: string;
  _id?: string;
  title: string;
  originalPrice: number;
  authors?: string[];
  covers?: { url: string; isPrimary: boolean }[];
  publisher?: string;
  description?: string;
};

type ShopBook = {
  id: string;
  title: string;
  author: string;
  price: string;
  cover: string;
  publisher?: string;
  description?: string;
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

async function getBooks(): Promise<ShopBook[]> {
  try {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/books?page=1&limit=20`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(
        'Books page request failed:',
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
        const bookId = book.id || book._id || '';

        return {
          id: bookId,
          title: book.title,
          author: book.authors?.join(', ') || 'Unknown author',
          price: `${Number(book.originalPrice).toLocaleString('vi-VN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} VNĐ`,
          cover:
            primaryCover ||
            fallbackCover ||
            'https://via.placeholder.com/300x450?text=No+Cover',
          publisher: book.publisher,
          description: book.description,
        };
      });
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return [];
  }
}

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <section className="min-h-screen bg-[#f7faf5] py-20 px-8 md:px-16 lg:px-24">
      <div className="max-w-8xl mx-auto">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#58615b] mb-3">
              Browse our catalog
            </p>
            <h1 className="text-5xl font-black text-[#1a3d2b]">All Books</h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#2d6a4f] font-semibold hover:opacity-80 transition-opacity"
          >
            Back to Home
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="rounded-3xl bg-white p-16 text-center shadow-lg">
            <p className="text-[#58615b] text-lg">
              No books available right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="group block overflow-hidden rounded-[2rem] bg-white shadow-xl transition-transform hover:-translate-y-1"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#f7faf5]">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#58615b] mb-2">
                    {book.publisher || 'Independent'}
                  </p>
                  <h2 className="text-xl font-black text-[#1a3d2b] mb-3 line-clamp-2">
                    {book.title}
                  </h2>
                  <p className="text-sm text-[#58615b] mb-4 line-clamp-2">
                    {book.description || 'No description available.'}
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-lg font-black text-[#2d6a4f]">
                      {book.price}
                    </span>
                    <span className="text-sm font-semibold text-[#1a3d2b]">
                      View details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
