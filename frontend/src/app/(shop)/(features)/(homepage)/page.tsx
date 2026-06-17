import Image from 'next/image';
import Link from 'next/link';
import mainImg from './assets/img.jpg';
import bgImg from './assets/img8.jpg';
import { BookSection } from './components/book-section';
import Category from './ui/category';
import { BookSectionHorizontal } from './ui/book-section-horizontal';
import { BookSectionHighlight } from './ui/book-section-featured';

type ApiBook = {
  id?: string;
  _id?: string;
  title: string;
  originalPrice: number;
  discountPercentage?: number;
  currentPrice?: number;
  isOnSale?: boolean;
  authors?: string[];
  covers?: { url: string; isPrimary: boolean }[];
  publisher?: string;
  description?: string;
};

type ApiGenre = {
  id?: string;
  _id?: string;
  name: string;
};

type ApiTopGenre = {
  genreId: string;
  genreName: string;
  unitsSold: number;
};

type HomepageBook = {
  id: string;
  title: string;
  author: string;
  price: string;
  originalPrice?: string;
  discountPercentage?: number;
  cover: string;
  publisher?: string;
  description?: string;
};

type HomepageGenre = {
  id: string;
  name: string;
  slug: string;
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

function formatVnd(value: number): string {
  return `${Number(value || 0).toLocaleString('vi-VN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} VNĐ`;
}

function getDiscountedPrice(originalPrice: number, discountPercentage: number) {
  return Math.max(0, originalPrice * (1 - discountPercentage / 100));
}

async function getHomepageBooks(
  endpoint: 'best-seller' | 'new-arrivals' | 'on-sales',
  limit = 10,
): Promise<HomepageBook[]> {
  try {
    const apiBase = getApiBaseUrl();
    const response = await fetch(
      `${apiBase}/${endpoint}?page=1&limit=${limit}`,
      {
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      console.error(
        `Homepage ${endpoint} request failed:`,
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
        const originalPrice = Number(book.originalPrice) || 0;
        const discountPercentage = Number(book.discountPercentage || 0);
        const hasDiscount = Boolean(book.isOnSale ?? discountPercentage > 0);
        const price =
          book.currentPrice !== undefined && book.currentPrice !== null
            ? Number(book.currentPrice)
            : hasDiscount
              ? getDiscountedPrice(originalPrice, discountPercentage)
              : originalPrice;

        return {
          id: book.id || book._id || '',
          title: book.title,
          author: book.authors?.join(', ') || 'Unknown author',
          price: formatVnd(price),
          originalPrice: hasDiscount ? formatVnd(originalPrice) : undefined,
          discountPercentage: hasDiscount ? discountPercentage : undefined,
          cover:
            primaryCover ||
            fallbackCover ||
            'https://via.placeholder.com/300x450?text=No+Cover',
          publisher: book.publisher,
          description: book.description,
        };
      });
  } catch {
    return [];
  }
}

function createSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function getHomepageGenres(): Promise<HomepageGenre[]> {
  const apiBase = getApiBaseUrl();

  try {
    const response = await fetch(`${apiBase}/shop-navigation`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      const topGenres: ApiTopGenre[] = Array.isArray(data?.topGenres)
        ? data.topGenres
        : [];
      const popularGenres = topGenres
        .filter((genre) => Boolean(genre.genreName))
        .sort((a, b) => Number(b.unitsSold) - Number(a.unitsSold))
        .slice(0, 4)
        .map((genre) => ({
          id: genre.genreId,
          name: genre.genreName,
          slug: createSlug(genre.genreName),
        }));

      if (popularGenres.length > 0) {
        return popularGenres;
      }
    } else {
      console.error(
        'Homepage popular genres request failed:',
        response.status,
        response.statusText,
      );
    }
  } catch {
    // Fall back to the genre list below when sales navigation is unavailable.
  }

  try {
    const response = await fetch(`${apiBase}/genres?page=1&limit=4`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(
        'Homepage genres request failed:',
        response.status,
        response.statusText,
      );
      return [];
    }

    const data = await response.json();
    const genres: ApiGenre[] = Array.isArray(data?.genres) ? data.genres : [];

    return genres
      .filter((genre) => Boolean(genre.name))
      .slice(0, 4)
      .map((genre) => ({
        id: genre.id || genre._id || genre.name,
        name: genre.name,
        slug: createSlug(genre.name),
      }));
  } catch {
    return [];
  }
}

export default async function Homepage() {
  const [bestSellerBooks, newArrivalBooks, onSaleBooks, genres] =
    await Promise.all([
      getHomepageBooks('best-seller', 4),
      getHomepageBooks('new-arrivals', 5),
      getHomepageBooks('on-sales', 10),
      getHomepageGenres(),
    ]);

  return (
    <>
      <section className="min-h-screen bg-[#f7faf5] flex items-center px-8 md:px-16 lg:px-24">
        <div className="max-w-8xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center py-12 md:py-20">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1a3d2b] leading-tight tracking-tight">
              Literature without{' '}
              <span className="italic text-[#2d6a4f]">borders.</span>
            </h1>

            <p className="text-[#58615b] text-base leading-relaxed max-w-xl">
              The finest international literature, translated into English.
              Carefully selected titles from every corner of the world — from
              the cobblestone streets of Europe to the quiet temples of Asia,
              one language, endless perspectives, infinite worlds to explore.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-2">
              <Link
                href="/new-arrivals"
                className="bg-[#2d6a4f] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#1a3d2b] transition-colors w-full sm:w-auto text-center"
              >
                Browse New Arrivals
              </Link>
              <Link
                href="/contact-us"
                className="text-[#1a3d2b] text-sm font-semibold hover:opacity-70 transition-opacity"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-2lg">
              <div className="rounded-3xl overflow-hidden shadow-2xl rotate-2">
                <Image
                  src={mainImg}
                  alt="Stack of books"
                  className="w-full h-[300px] sm:h-[400px] md:h-[620px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Category genres={genres} />

      {bestSellerBooks.length > 0 && (
        <BookSectionHighlight
          label="Crowd Favorites"
          title="CURRENT BEST SELLER"
          books={bestSellerBooks}
        />
      )}

      {newArrivalBooks.length > 0 && (
        <BookSectionHorizontal
          label="Just In"
          title="NEW ARRIVALS"
          books={newArrivalBooks}
          viewAllHref="/new-arrivals"
        />
      )}

      {onSaleBooks.length > 0 && (
        <BookSection
          label="Limited Time"
          title="ON SALES"
          books={onSaleBooks}
          visible={10}
          viewAllHref="/on-sales"
        />
      )}

      <br />
      <br />
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-16 md:mb-32">
        <div className="relative rounded-3xl overflow-hidden">
          <Image
            src={bgImg}
            alt="Background"
            fill
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 p-8 md:p-12 lg:p-24 max-w-3xl text-white">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Find Your Next Favorite Book.
            </h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              Explore our curated collection of world literature — timeless
              classics, modern voices, and everything in between.
            </p>
            <br />
            <Link
              href="/books"
              className="inline-flex items-center gap-3 bg-[#2d6a4f] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#1a3d2b] hover:scale-[0.98] active:scale-95 transition-all"
            >
              Browse All Books
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
