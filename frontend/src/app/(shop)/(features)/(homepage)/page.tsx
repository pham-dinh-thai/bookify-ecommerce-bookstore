import Image from 'next/image';
import Link from 'next/link';
import mainImg from './assets/main.jpg';
import { BookSection } from './components/book-section';

const newArrivals = [
  {
    id: 1,
    title: 'Crime and punishment',
    author: 'Matt Haig',
    price: '180.000₫',
    cover:
      'https://tse1.mm.bing.net/th/id/OIP.dI055T7RdiMDYUAVQbp88AHaLX?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    id: 2,
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    price: '210.000₫',
    cover: 'https://m.media-amazon.com/images/I/91pSaVjfShL._SL1500_.jpg',
  },
  {
    id: 3,
    title: 'The Vegetarian',
    author: 'Han Kang',
    price: '165.000₫',
    cover: 'https://m.media-amazon.com/images/I/71rQZuITMKL._SL1500_.jpg',
  },
  {
    id: 4,
    title: 'Normal People',
    author: 'Sally Rooney',
    price: '195.000₫',
    cover:
      'https://m.media-amazon.com/images/I/411B+9Nj91L._SY445_SX342_QL70_FMwebp_.jpg',
  },
  {
    id: 5,
    title: 'Normal People',
    author: 'Sally Rooney',
    price: '195.000₫',
    cover: 'https://m.media-amazon.com/images/I/71j7bZTiYAL._SL1500_.jpg',
  },
];

export default function Homepage() {
  return (
    <>
      {/* Hero section */}
      <section className="min-h-screen bg-[#f7faf5] flex items-center px-8 md:px-16 lg:px-24">
        <div className="max-w-8xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20">
          {/* Left content */}
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl md:text-6xl font-bold text-[#1a3d2b] leading-tight tracking-tight">
              Literature without{' '}
              <span className="italic text-[#2d6a4f]">borders.</span>
            </h1>

            <p className="text-[#58615b] text-base leading-relaxed max-w-md">
              Explore a meticulously curated selection of international voices.
              From the streets of Paris to the hubs of Tokyo, we bring the
              world's most profound narratives to your shelf.
            </p>

            <div className="flex items-center gap-6 mt-2">
              <Link
                href="/books"
                className="bg-[#2d6a4f] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#1a3d2b] transition-colors"
              >
                Browse New Arrivals
              </Link>
              <Link
                href="/philosophy"
                className="text-[#1a3d2b] text-sm font-semibold hover:opacity-70 transition-opacity"
              >
                Our Philosophy
              </Link>
            </div>
          </div>

          {/* Right image */}
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

      <BookSection label="Just In" title="New Arrivals" books={newArrivals} />
      <BookSection label="Limited Time" title="On Sales" books={newArrivals} />
      <BookSection label="Top Picks" title="Best Seller" books={newArrivals} />
    </>
  );
}
