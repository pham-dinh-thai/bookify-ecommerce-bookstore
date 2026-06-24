import Link from 'next/link';
import CollectionPageContent from './collection-page-content';

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

          <CollectionPageContent key={`${type}-${genreSlug || ''}-${searchQuery || ''}`} books={books} pageSize={pageSize} />
        </div>
      </div>
    </section>
  );
}
