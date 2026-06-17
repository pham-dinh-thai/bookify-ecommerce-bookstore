import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import CollectionPagePagination from './collection-page-pagination';

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

type TopGenre = {
  genreId: string;
  genreName: string;
  unitsSold: number;
  revenue: number;
};

type TopAuthor = {
  authorId: string;
  authorName: string;
  unitsSold: number;
  revenue: number;
};

type ShopNavigation = {
  topGenres: TopGenre[];
  topAuthors: TopAuthor[];
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

function getDiscountedPrice(originalPrice: number, discountPercentage: number) {
  return Math.max(0, originalPrice * (1 - discountPercentage / 100));
}

async function getBooks(
  type: CollectionType,
  genreSlug?: string,
  searchQuery?: string,
): Promise<ApiBook[]> {
  try {
    const apiBase = getApiBaseUrl();
    const endpoint =
      type === 'on-sales'
        ? 'on-sales'
        : type === 'new-arrivals'
          ? 'new-arrivals'
          : 'books';
    const response = await fetch(`${apiBase}/${endpoint}?page=1&limit=50`, {
      cache: 'no-store',
    });

    if (!response.ok) return [];

    const data = await response.json();
    const books: ApiBook[] = Array.isArray(data?.books) ? data.books : [];

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

async function getShopNavigation(): Promise<ShopNavigation> {
  try {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/shop-navigation`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return { topGenres: [], topAuthors: [] };
    }

    const data = await response.json();

    return {
      topGenres: Array.isArray(data?.topGenres) ? data.topGenres : [],
      topAuthors: Array.isArray(data?.topAuthors) ? data.topAuthors : [],
    };
  } catch {
    return { topGenres: [], topAuthors: [] };
  }
}

export default async function CollectionPage({
  type,
  heading,
  description,
  genreSlug,
  searchQuery,
}: CollectionPageProps) {
  const [books, shopNavigation] = await Promise.all([
    getBooks(type, genreSlug, searchQuery),
    getShopNavigation(),
  ]);
  const pageSize = 20;
  const displayBooks = books.slice(0, pageSize);
  const fallbackGenres = Array.from(
    new Set(books.flatMap((book) => book.genres || [])),
  )
    .slice(0, 5)
    .map((genre) => ({ genreId: normalize(genre), genreName: genre }));
  const fallbackAuthors = Array.from(
    new Set(books.flatMap((book) => book.authors || [])),
  )
    .slice(0, 5)
    .map((author) => ({ authorId: normalize(author), authorName: author }));
  const sidebarGenres =
    shopNavigation.topGenres.length > 0
      ? shopNavigation.topGenres
      : fallbackGenres;
  const sidebarAuthors =
    shopNavigation.topAuthors.length > 0
      ? shopNavigation.topAuthors
      : fallbackAuthors;
  const collectionLinks = [
    { label: 'All books', href: '/books' },
    { label: 'Best seller', href: '/best-seller' },
    { label: 'New Arrivals', href: '/new-arrivals' },
    { label: 'On Sales', href: '/on-sales' },
  ];

  return (
    <section className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-16">
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface mb-4 leading-tight">
            {heading}
          </h1>
          <p className="text-on-surface-variant max-w-2xl text-sm md:text-lg leading-relaxed">
            {description}
          </p>
        </header>

        {/* Mobile horizontal scroll filters */}
        <div className="md:hidden mb-6 -mx-6 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 px-6 pb-2 min-w-max">
            <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-on-surface-variant shrink-0 mr-1">
              Collection
            </span>
            {collectionLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-[#d6ded4] bg-white px-3.5 py-1.5 text-[12px] font-medium text-on-surface-variant hover:bg-[#f5fbf5] hover:text-primary transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
            <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-on-surface-variant shrink-0 ml-2 mr-1">
              Genre
            </span>
            {sidebarGenres.map((genre) => (
              <Link
                key={genre.genreId}
                href={`/genres/${normalize(genre.genreName)}`}
                className="shrink-0 rounded-full border border-[#d6ded4] bg-white px-3.5 py-1.5 text-[12px] font-medium text-on-surface-variant hover:bg-[#f5fbf5] hover:text-primary transition-colors whitespace-nowrap"
              >
                {genre.genreName}
              </Link>
            ))}
            <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-on-surface-variant shrink-0 ml-2 mr-1">
              Author
            </span>
            {sidebarAuthors.map((author) => (
              <Link
                key={author.authorId}
                href={`/books?q=${encodeURIComponent(author.authorName)}`}
                className="shrink-0 rounded-full border border-[#d6ded4] bg-white px-3.5 py-1.5 text-[12px] font-medium text-on-surface-variant hover:bg-[#f5fbf5] hover:text-primary transition-colors whitespace-nowrap"
              >
                {author.authorName}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <aside className="hidden md:block w-64 space-y-10 shrink-0">
            <section>
              <h3 className="text-xs font-bold tracking-[0.05em] uppercase text-on-surface mb-6">
                Collection
              </h3>
              <ul className="space-y-4">
                {collectionLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xs font-bold tracking-[0.05em] uppercase text-on-surface mb-6">
                Genre
              </h3>
              <ul className="space-y-4">
                {sidebarGenres.map((genre) => (
                  <li key={genre.genreId}>
                    <Link
                      href={`/genres/${normalize(genre.genreName)}`}
                      className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {genre.genreName}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xs font-bold tracking-[0.05em] uppercase text-on-surface mb-6">
                Author
              </h3>
              <ul className="space-y-4">
                {sidebarAuthors.map((author) => (
                  <li key={author.authorId}>
                    <Link
                      href={`/books?q=${encodeURIComponent(author.authorName)}`}
                      className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {author.authorName}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-10 gap-4 ">
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
              <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-10 text-center">
                <p className="text-on-surface-variant">
                  No books found for this collection.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12">
                  {displayBooks.map((book) => {
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
