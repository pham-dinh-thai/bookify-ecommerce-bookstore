import Link from 'next/link';

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
};

function getApiBaseUrl(): string {
  const internalUrl = process.env.API_INTERNAL_URL;
  const publicUrl = process.env.NEXT_PUBLIC_API_URL;

  if (internalUrl) return internalUrl.replace(/\/$/, '');
  if (publicUrl) return publicUrl.replace(/\/$/, '');

  return '/api';
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-');
}

async function getBooks(type: CollectionType, genreSlug?: string): Promise<ApiBook[]> {
  try {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/books?page=1&limit=100`, {
      cache: 'no-store',
    });

    if (!response.ok) return [];

    const data = await response.json();
    const books: ApiBook[] = Array.isArray(data?.books) ? data.books : [];

    if (type === 'on-sales') {
      return books.filter((book) => book.isOnSale || Number(book.salePrice) > 0);
    }

    if (type === 'new-arrivals') {
      return books.filter((book) => book.isNewArrival);
    }

    if (genreSlug) {
      return books.filter((book) =>
        (book.genres || []).some((genre) => normalize(genre) === genreSlug),
      );
    }

    return books;
  } catch {
    return [];
  }
}

export default async function CollectionPage({
  type,
  heading,
  description,
  genreSlug,
}: CollectionPageProps) {
  const books = (await getBooks(type, genreSlug)).filter((book) => Boolean(book.id || book._id));
  const visibleBooks = books.slice(0, 20);

  return (
    <section className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <main className="pb-20 max-w-7xl mx-auto px-6 md:px-8 pt-14 md:pt-16">
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
              <h3 className="text-xs font-bold tracking-[0.05em] uppercase text-on-surface mb-6">Language</h3>
              <ul className="space-y-4 text-sm text-on-surface-variant">
                <li className="hover:text-primary transition-colors cursor-pointer">English</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Vietnamese</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Japanese</li>
              </ul>
            </section>
            <section>
              <h3 className="text-xs font-bold tracking-[0.05em] uppercase text-on-surface mb-6">Genre</h3>
              <ul className="space-y-4 text-sm text-on-surface-variant">
                <li className="hover:text-primary transition-colors cursor-pointer">Contemporary Fiction</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Magic Realism</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Classic Philosophy</li>
              </ul>
            </section>
            <section>
              <h3 className="text-xs font-bold tracking-[0.05em] uppercase text-on-surface mb-6">Author</h3>
              <ul className="space-y-4 text-sm text-on-surface-variant">
                <li className="hover:text-primary transition-colors cursor-pointer">Haruki Murakami</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Albert Camus</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Hermann Hesse</li>
              </ul>
            </section>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 border-b border-outline-variant/10 pb-6">
              <p className="text-sm font-medium text-on-surface-variant">
                Showing <span className="text-on-surface font-bold">{visibleBooks.length}</span> of{' '}
                <span className="text-on-surface font-bold">{books.length}</span> volumes
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant group-hover:text-primary transition-colors">
                    Sort: Newest
                  </span>
                  <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {visibleBooks.map((book) => {
                const primaryCover = book.covers?.find((cover) => cover.isPrimary)?.url;
                const fallbackCover = book.covers?.[0]?.url;
                const bookId = book.id || book._id;
                const displayPrice = type === 'on-sales' && book.salePrice ? book.salePrice : book.originalPrice;

                if (!bookId) return null;

                return (
                  <Link key={bookId} href={`/books/${bookId}`} className="group">
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
                        {Number(displayPrice || 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        $
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-20 flex justify-center items-center gap-4">
              <button className="w-12 h-12 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <div className="flex items-center gap-2">
                <button className="w-12 h-12 rounded-full bg-primary text-on-primary font-bold">1</button>
                <button className="w-12 h-12 rounded-full hover:bg-surface-container-high transition-colors font-medium">2</button>
                <button className="w-12 h-12 rounded-full hover:bg-surface-container-high transition-colors font-medium">3</button>
                <span className="px-2">...</span>
                <button className="w-12 h-12 rounded-full hover:bg-surface-container-high transition-colors font-medium">8</button>
              </div>
              <button className="w-12 h-12 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
