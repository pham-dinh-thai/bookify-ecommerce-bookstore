import Link from 'next/link';

type ApiBook = {
  id?: string;
  _id?: string;
  title: string;
  originalPrice: number;
  quantity: number;
  authors?: string[];
  covers?: { url: string; isPrimary: boolean }[];
  publisher?: string;
};

type BestSellerBook = {
  id: string;
  title: string;
  author: string;
  cover: string;
  publisher: string;
  originalPrice: number;
  quantity: number;
  estimatedRevenue: number;
};

function getApiBaseUrl(): string {
  const internalUrl = process.env.API_INTERNAL_URL;
  const publicUrl = process.env.NEXT_PUBLIC_API_URL;

  if (internalUrl) return internalUrl.replace(/\/$/, '');
  if (publicUrl) return publicUrl.replace(/\/$/, '');

  return '/api';
}

async function getBestSellerBooks(): Promise<BestSellerBook[]> {
  try {
    const apiBase = getApiBaseUrl();
    const response = await fetch(`${apiBase}/books?page=1&limit=100`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Best seller request failed:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    const books: ApiBook[] = Array.isArray(data?.books) ? data.books : [];

    return books
      .filter((book) => Boolean(book.id || book._id))
      .map((book) => {
        const primaryCover = book.covers?.find((cover) => cover.isPrimary)?.url;
        const fallbackCover = book.covers?.[0]?.url;

        return {
          id: book.id || book._id || '',
          title: book.title,
          author: book.authors?.join(', ') || 'Unknown author',
          cover: primaryCover || fallbackCover || 'https://via.placeholder.com/300x450?text=No+Cover',
          publisher: book.publisher || 'Independent',
          originalPrice: Number(book.originalPrice) || 0,
          quantity: Number(book.quantity) || 0,
          estimatedRevenue: (Number(book.originalPrice) || 0) * (Number(book.quantity) || 0),
        };
      })
      .sort((a, b) => b.estimatedRevenue - a.estimatedRevenue)
      .slice(0, 10);
  } catch (error) {
    console.error('Failed to fetch best seller books:', error);
    return [];
  }
}

function formatVnd(value: number) {
  return `${value.toLocaleString('vi-VN')} VNĐ`;
}

export default async function BestSellerPage() {
  const books = await getBestSellerBooks();

  return (
    <section className="min-h-screen bg-[#f7faf5] py-20 px-8 md:px-16 lg:px-24">
      <div className="max-w-8xl mx-auto">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#58615b] mb-3">Top 10 ranking</p>
            <h1 className="text-5xl font-black text-[#1a3d2b]">Best Seller</h1>
            <p className="mt-4 text-sm text-[#58615b]">
              * Tạm thời xếp hạng theo doanh thu ước tính = giá gốc × số lượng tồn kho.
            </p>
          </div>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-[#2d6a4f] font-semibold hover:opacity-80 transition-opacity"
          >
            Xem tất cả sách
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="rounded-3xl bg-white p-16 text-center shadow-lg">
            <p className="text-[#58615b] text-lg">Chưa có dữ liệu để hiển thị bảng xếp hạng.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="grid grid-cols-12 border-b border-[#e7efe8] bg-[#f3f8f4] px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#58615b]">
              <span className="col-span-1">#</span>
              <span className="col-span-5">Sách</span>
              <span className="col-span-2 text-right">Giá</span>
              <span className="col-span-2 text-right">Tồn kho</span>
              <span className="col-span-2 text-right">Doanh thu</span>
            </div>

            {books.map((book, index) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="grid grid-cols-12 items-center gap-4 border-b border-[#eef3ef] px-6 py-4 transition-colors hover:bg-[#f8fcf9]"
              >
                <span className="col-span-1 text-xl font-black text-[#2d6a4f]">{index + 1}</span>

                <div className="col-span-5 flex items-center gap-4">
                  <img src={book.cover} alt={book.title} className="h-20 w-14 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm uppercase tracking-[0.1em] text-[#58615b]">{book.publisher}</p>
                    <h2 className="text-lg font-bold text-[#1a3d2b] line-clamp-2">{book.title}</h2>
                    <p className="text-sm text-[#58615b] line-clamp-1">{book.author}</p>
                  </div>
                </div>

                <span className="col-span-2 text-right font-semibold text-[#1a3d2b]">{formatVnd(book.originalPrice)}</span>
                <span className="col-span-2 text-right font-semibold text-[#1a3d2b]">{book.quantity}</span>
                <span className="col-span-2 text-right font-black text-[#2d6a4f]">{formatVnd(book.estimatedRevenue)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
