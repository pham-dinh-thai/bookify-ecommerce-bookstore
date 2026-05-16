import Image from 'next/image';
import Link from 'next/link';
import mainImg from './assets/img.jpg';
import bgImg from './assets/img8.jpg';
import { BookSection } from './components/book-section';
import Category from './ui/category';
import { BookSectionHorizontal } from './ui/book-section-horizontal';
import { BookSectionHighlight } from './ui/book-section-featured';

type ApiBook = {
  id: string;
  title: string;
  originalPrice: number;
  authors?: string[];
  covers?: { url: string; isPrimary: boolean }[];
  publisher?: string;
  description?: string;
};

type HomepageBook = {
  id: number;
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

async function getHomepageBooks(): Promise<HomepageBook[]> {
  try {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/books?page=1&limit=10`);

    if (!response.ok) {
      console.error(
        'Homepage books request failed:',
        response.status,
        response.statusText,
      );
      return [];
    }

    const data = await response.json();
    const books: ApiBook[] = Array.isArray(data?.books) ? data.books : [];

    return books.map((book, index) => {
      const primaryCover = book.covers?.find((cover) => cover.isPrimary)?.url;
      const fallbackCover = book.covers?.[0]?.url;

      return {
        id: index + 1,
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
  } catch {
    return [];
  }
}

export default async function Homepage() {
  const books = await getHomepageBooks();

  console.log('Fetched books for homepage:', books);

  return (
    <>
      <section className="min-h-screen bg-[#f7faf5] flex items-center px-8 md:px-16 lg:px-24">
        <div className="max-w-8xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20">
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl md:text-6xl font-bold text-[#1a3d2b] leading-tight tracking-tight">
              Literature without{' '}
              <span className="italic text-[#2d6a4f]">borders.</span>
            </h1>

            <p className="text-[#58615b] text-base leading-relaxed max-w-xl">
              The finest international literature, translated into English.
              Carefully selected titles from every corner of the world — from
              the cobblestone streets of Europe to the quiet temples of Asia,
              one language, endless perspectives, infinite worlds to explore.
            </p>

            <div className="flex items-center gap-6 mt-2">
              <Link
                href="/books"
                className="bg-[#2d6a4f] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#1a3d2b] transition-colors"
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
                  className="w-full h-[620px] object-cover"
                />
              </div>
              <div className="absolute bottom-1 left-[-24px] bg-white rounded-2xl shadow-xl px-6 py-6 flex flex-col gap-1 min-w-[200px] min-h-[80px] -rotate-2">
                <span className="text-[9px] uppercase tracking-widest text-[#58615b] font-bold">
                  UTC+7. 2026
                </span>
                <span className="text-[#1a3d2b] text-sm font-bold">
                  Bookify
                </span>
                <span className="text-[#58615b] text-[11px]">
                  Hanoi, Vietnam
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Category />

      {books.length > 0 && (
        <>
          <BookSectionHighlight
            label="Crowd Favorites"
            title="CURRENT BEST SELLER"
            books={books}
          />
          <BookSectionHorizontal
            label="Just In"
            title="NEW ARRIVALS"
            books={books}
          />
          <BookSection label="Limited Time" title="ON SALES" books={books} />
        </>
      )}

      <br />
      <br />
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="relative rounded-3xl overflow-hidden">
          <Image
            src={bgImg}
            alt="Background"
            fill
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 p-12 lg:p-24 max-w-3xl text-white">
            <h2 className="text-4xl font-bold tracking-tight mb-6">
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
