import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import CollectionPagePagination from './collection-page-pagination';

type ApiBook = {
  id?: string;
  _id?: string;
  title: string;
  originalPrice: number;
  salePrice?: number;
  isOnSale?: boolean;
  isNewArrival?: boolean;
  genres?: string[];
  authors?: string[];
  covers?: { url: string; isPrimary: boolean }[];
};

type CollectionType = 'genre' | 'on-sales' | 'new-arrivals';

type CollectionPageProps = {
  type: CollectionType;
  heading: string;
  description: string;
  genreSlug?: string;
  searchQuery?: string;
};

function getApiBaseUrl(): string {
  const internalUrl = process.env.API_INTERNAL_URL;
  const publicUrl = process.env.NEXT_PUBLIC_API_URL;

  if (internalUrl) return internalUrl.replace(/\/$/, '');
  if (publicUrl) return publicUrl.replace(/\/$/, '');

  return '/api';
}

function normalize(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatCurrency(amount: number): string {
  return `${Number(amount || 0).toLocaleString('vi-VN')} VNĐ`;
}

async function getBooks(
  type: CollectionType,
  genreSlug?: string,
  searchQuery?: string,
): Promise<ApiBook[]> {
  try {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/books?page=1&limit=50`, {
      cache: 'no-store',
    });

    if (!response.ok) return [];

    const data = await response.json();
    const books: ApiBook[] = Array.isArray(data?.books) ? data.books : [];

    if (type === 'on-sales') {
      const onSaleBooks = books.filter(
        (book) => book.isOnSale || Number(book.salePrice) > 0,
      );
      return onSaleBooks.length > 0 ? onSaleBooks : books;
    }

    if (type === 'new-arrivals') {
      const newArrivalBooks = books.filter((book) => book.isNewArrival);
      return newArrivalBooks.length > 0 ? newArrivalBooks : books;
    }

    let filteredBooks = books;

    const normalizedGenreSlug = genreSlug ? normalize(genreSlug) : undefined;

    if (normalizedGenreSlug) {
      filteredBooks = books.filter((book) =>
        (book.genres || []).some(
          (genre) => normalize(genre) === normalizedGenreSlug,
        ),
      );
    }

    const normalizedSearchQuery = searchQuery?.trim().toLowerCase();

    if (!normalizedSearchQuery) {
      return filteredBooks;
    }

    return filteredBooks.filter((book) => {
      const title = book.title?.toLowerCase() || '';
      const authors = (book.authors || []).join(' ').toLowerCase();
      const genres = (book.genres || []).join(' ').toLowerCase();

      return (
        title.includes(normalizedSearchQuery) ||
        authors.includes(normalizedSearchQuery) ||
        genres.includes(normalizedSearchQuery)
      );
    });
  } catch {
    return [];
  }
}

export default async function CollectionPage({
  type,
  heading,
  description,
  genreSlug,
  searchQuery,
}: CollectionPageProps) {
  const books = await getBooks(type, genreSlug, searchQuery);
  const pageSize = 20;
  const displayBooks = books.slice(0, pageSize);

  return (
    <section className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-14 md:py-16">
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface mb-4 leading-tight">
            {heading}
          </h1>
          <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
            {description}
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-12">
          <aside className="w-full md:w-64 space-y-10 shrink-0">
            <section>
              <h3 className="text-xs font-bold tracking-[0.05em] uppercase text-on-surface mb-6">
                Collection
              </h3>
              <ul className="space-y-4">
                <li className="text-sm font-medium text-on-surface-variant">
                  All books
                </li>
                <li className="text-sm font-medium text-on-surface-variant">
                  Best sellers
                </li>
                <li className="text-sm font-semibold text-primary">
                  Curated picks
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xs font-bold tracking-[0.05em] uppercase text-on-surface mb-6">
                Genre
              </h3>
              <ul className="space-y-4">
                {Array.from(new Set(books.flatMap((book) => book.genres || [])))
                  .slice(0, 5)
                  .map((genre) => (
                    <li
                      key={genre}
                      className="text-sm font-medium text-on-surface-variant"
                    >
                      {genre}
                    </li>
                  ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xs font-bold tracking-[0.05em] uppercase text-on-surface mb-6">
                Author
              </h3>
              <ul className="space-y-4">
                {Array.from(
                  new Set(books.flatMap((book) => book.authors || [])),
                )
                  .slice(0, 5)
                  .map((author) => (
                    <li
                      key={author}
                      className="text-sm font-medium text-on-surface-variant"
                    >
                      {author}
                    </li>
                  ))}
              </ul>
            </section>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 ">
              <p className="text-sm font-medium text-on-surface-variant">
                Showing{' '}
                <span className="text-on-surface font-bold">
                  {displayBooks.length}
                </span>{' '}
                of{' '}
                <span className="text-on-surface font-bold">
                  {books.length}
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

            {displayBooks.length === 0 ? (
              <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-10 text-center">
                <p className="text-on-surface-variant">
                  No books found for this collection.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                  {displayBooks.map((book) => {
                    const primaryCover = book.covers?.find(
                      (cover) => cover.isPrimary,
                    )?.url;
                    const fallbackCover = book.covers?.[0]?.url;
                    const bookId = book.id || book._id;
                    const displayPrice =
                      type === 'on-sales' && book.salePrice
                        ? book.salePrice
                        : book.originalPrice;

                    if (!bookId) return null;

                    return (
                      <Link
                        key={bookId}
                        href={`/books/${bookId}`}
                        className="group"
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
                        <div className="mt-4">
                          <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant block mb-1">
                            {(book.genres && book.genres[0]) || 'Collection'}
                          </span>
                          <h2 className="text-lg font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors leading-tight line-clamp-2">
                            {book.title}
                          </h2>
                          <p className="text-sm text-on-surface-variant mb-2 line-clamp-1">
                            {book.authors?.join(', ') || 'Unknown author'}
                          </p>
                          <span className="text-sm font-bold text-on-surface">
                            {formatCurrency(displayPrice)}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-20 flex justify-center items-center gap-4">
                  <CollectionPagePagination
                    pageSize={pageSize}
                    total={books.length}
                    showTotal={false}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
