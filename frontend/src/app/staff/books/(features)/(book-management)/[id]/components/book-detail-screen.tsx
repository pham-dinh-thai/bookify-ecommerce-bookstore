'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import useBookDetail from '../../hooks/use-book-detail';
import BookFormNavigate from '../../../../components/book-form-navigate';
import BookDetailHeader from '../ui/book-detail-header';
import BasicInformation from '../ui/basic-information';
import {
  Edit3,
  Plus,
  Minus,
  RefreshCcw,
  TrendingUp,
  Trash2,
  Boxes,
} from 'lucide-react';
import useBookPriceUpdate from '../hooks/use-book-price-update';
import useBookStockAdjust from '../hooks/use-book-stock-adjust';

export default function BookDetailScreen({ id }: { id: string }) {
  const { book, loading, errors, refetch } = useBookDetail(id);
  const { updatingPrice, priceInput, setPriceInput, handleUpdatePrice } =
    useBookPriceUpdate({ book, bookId: id, refetch });
  const { adjustingStock, handleAdjustStock } = useBookStockAdjust({
    bookId: id,
    refetch,
  });
  const [quantityInput, setQuantityInput] = useState<string | null>(null);

  const handleQuantityInputChange = (value: string) => {
    const numValue = value.replace(/\D/g, '');
    setQuantityInput(numValue || '0');
  };

  const handleAdjustQuantity = (delta: number) => {
    const current = Number(quantityInput ?? book?.quantity ?? 0);
    const newValue = Math.max(0, current + delta);
    setQuantityInput(String(newValue));
  };

  const handleUpdateQuantity = async () => {
    const newQuantity = Number(quantityInput ?? book?.quantity ?? 0);
    if (newQuantity === (book?.quantity || 0)) return;

    await handleAdjustStock(newQuantity);
  };

  const statusLabel = useMemo(() => {
    if (!book) return 'Unknown';
    return book.isInStock ? 'In stock' : 'Out of stock';
  }, [book]);

  useEffect(() => {
    if (book) {
      setQuantityInput(String(book.quantity || 0));
    }
  }, [book]);

  const displayQuantity = quantityInput ?? String(book?.quantity || 0);

  if (loading)
    return (
      <div className="p-12 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-white p-12 shadow-sm border border-slate-200 animate-pulse h-[600px]" />
      </div>
    );
  if (errors || !book)
    return (
      <div className="p-12 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-white p-12 shadow-sm border border-slate-200">
          <p className="text-base text-red-600">
            Unable to load book details. Please try again.
          </p>
          <Link
            href="/staff/books"
            className="mt-4 inline-flex items-center rounded-full bg-[#2d6a4f] px-4 py-3 text-sm font-semibold text-white hover:bg-[#23543f] transition-colors"
          >
            Back to book list
          </Link>
        </div>
      </div>
    );

  const coverUrl =
    book.covers && book.covers.length > 0
      ? book.covers[0].url
      : 'https://tse1.mm.bing.net/th/id/OIP.dI055T7RdiMDYUAVQbp88AHaLX?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3';

  return (
    <div className="p-12 max-w-7xl mx-auto">
      {/* unchanged UI */}
      <div className="flex flex-col gap-6 mb-12">
        <BookFormNavigate label="Book Detail" />
        <BookDetailHeader book={book} />
      </div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          {/* ... */}
          <div className="rounded-3xl bg-[#f7faf5] p-6 shadow-sm border border-[#dbe5dd] group">
            <div className="relative aspect-[2/3] overflow-hidden bg-[#e8f0e9] mb-6">
              <img
                src={coverUrl}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                <button className="w-12 h-12 rounded-full bg-white text-[#335b48] shadow-lg hover:scale-110 transition-transform flex items-center justify-center">
                  <Edit3 size={20} />
                </button>
                <button className="w-12 h-12 rounded-full bg-white text-[#a83836] shadow-lg hover:scale-110 transition-transform flex items-center justify-center">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button className="w-full rounded-xl bg-[#c1ecd4] py-3 text-sm font-bold text-[#325947] hover:bg-[#b3dec6] transition-colors">
                Update cover image
              </button>
              <button className="w-full rounded-xl border border-[#fa746f]/20 bg-white py-3 text-sm font-semibold text-[#a83836] hover:bg-[#fff0f0] transition-colors">
                Remove current cover
              </button>
            </div>
          </div>
          <div className="rounded-3xl bg-[#f7faf5] p-6 shadow-sm border border-[#dbe5dd]">
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[#58615b] mb-4">
              Inventory status
            </h2>
            <div className="flex items-center justify-between rounded-3xl border border-[#aab4ad]/15 bg-white p-4">
              <div className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full animate-pulse ${
                    book.isInStock ? 'bg-[#3f6754]' : 'bg-[#dc2626]'
                  }`}
                />
                <span className="font-semibold text-[#2b352f]">
                  {statusLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-full p-1 text-[#58615b] transition-colors hover:bg-[#f2f5f3]"
                title="Reload page"
              >
                <RefreshCcw size={18} className="text-[#58615b]" />
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          <BasicInformation book={book} onUpdated={refetch} />
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-3xl bg-[#f7faf5] p-8 shadow-sm border-l-4 border-[#3f6754]">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#58615b] mb-6">
                Unit price (VND)
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <input
                    value={priceInput}
                    onChange={(event) =>
                      setPriceInput(event.target.value.replace(/\D/g, ''))
                    }
                    inputMode="numeric"
                    pattern="[0-9]*"
                    title="Only numbers are allowed"
                    className="w-full rounded-3xl bg-white p-4 pl-5 text-xl font-black text-[#2b352f] ring-1 ring-[#c1ecd4] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleUpdatePrice}
                  disabled={updatingPrice}
                  className="h-14 w-14 rounded-3xl bg-[#c1ecd4] text-[#325947] transition-colors hover:bg-[#b3dec6] disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center"
                >
                  <TrendingUp size={20} />
                </button>
              </div>
              <p className="mt-4 text-[10px] italic text-[#58615b]">
                Current price may change depending on active campaigns.
              </p>
            </div>
            <div className="rounded-3xl bg-[#f7faf5] p-8 shadow-sm border-l-4 border-[#3c6091]">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#58615b] mb-6">
                Stock quantity
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex h-14 flex-1 items-center justify-between overflow-hidden rounded-3xl bg-white ring-1 ring-[#c1ecd4]">
                  <button
                    type="button"
                    onClick={() => handleAdjustQuantity(-1)}
                    disabled={adjustingStock}
                    className="h-full w-14 transition-colors hover:bg-[#f1f1f1] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Minus size={18} className="text-[#2b352f]" />
                  </button>
                  <input
                    value={displayQuantity}
                    onChange={(event) =>
                      handleQuantityInputChange(event.target.value)
                    }
                    inputMode="numeric"
                    pattern="[0-9]*"
                    title="Only numbers are allowed"
                    className="w-full border-none bg-transparent text-center text-xl font-black text-[#2b352f] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAdjustQuantity(1)}
                    disabled={adjustingStock}
                    className="h-full w-14 transition-colors hover:bg-[#f1f1f1] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Plus size={18} className="text-[#2b352f]" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleUpdateQuantity}
                  disabled={
                    adjustingStock ||
                    Number(displayQuantity) === (book?.quantity || 0)
                  }
                  className="h-14 w-14 rounded-3xl bg-[#d4e3ff] text-[#2d5383] transition-colors hover:bg-[#c5d9ff] disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center"
                  title="Save quantity"
                >
                  <Boxes size={20} />
                </button>
              </div>
              <p className="mt-4 text-[10px] italic text-[#58615b]">
                Stock level:{' '}
                {book.quantity > 50
                  ? 'High'
                  : book.quantity > 10
                    ? 'Medium'
                    : 'Low'}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
