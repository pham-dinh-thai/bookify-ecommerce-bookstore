'use client';

import { useMemo, useState, useEffect } from 'react';
import ImageUpload from '@/shared/common/components/image-upload/image-upload';
import Link from 'next/link';
import useBookDetail from '../../hooks/use-book-detail';
import BookFormNavigate from '../../../../components/book-form-navigate';
import BookDetailHeader from '../ui/book-detail-header';
import BasicInformation from '../ui/basic-information';
import { Trash2 } from 'lucide-react';
import useBookPriceUpdate from '../hooks/use-book-price-update';
import useBookDiscountPercentageUpdate from '../hooks/use-book-discount-percentage-update';
import useBookStockAdjust from '../hooks/use-book-stock-adjust';
import useBookCoverManager from '../hooks/use-book-cover-manager';
import RefreshButton from '@/shared/common/components/refresh-button';

export default function BookDetailScreen({ id }: { id: string }) {
  const { book, loading, errors, refetch } = useBookDetail(id);
  const { updatingPrice, priceInput, setPriceInput, handleUpdatePrice } =
    useBookPriceUpdate({ book, bookId: id, refetch });
  const {
    updatingDiscountPercentage,
    discountPercentageInput,
    setDiscountPercentageInput,
    handleUpdateDiscountPercentage,
  } = useBookDiscountPercentageUpdate({ book, bookId: id, refetch });
  const { adjustingStock, handleAdjustStock } = useBookStockAdjust({
    bookId: id,
    refetch,
  });
  const [quantityInput, setQuantityInput] = useState<string | null>(null);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const {
    uploadingCover,
    deletingCoverId,
    changingPrimaryCoverId,
    handleAddCover,
    handleChangePrimaryCover,
    handleDeleteCover,
  } = useBookCoverManager({
    bookId: id,
    refetch,
  });

  const handleQuantityInputChange = (value: string) => {
    const numValue = value.replace(/\D/g, '');
    setQuantityInput(numValue || '0');
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
  const salePrice = useMemo(() => {
    const originalPrice = Number(book?.originalPrice ?? 0);
    const discountPercentage = Number(discountPercentageInput || 0);

    if (discountPercentage === Number(book?.discountPercentage ?? 0)) {
      return Number(book?.currentPrice ?? originalPrice);
    }

    return Math.max(0, originalPrice * (1 - discountPercentage / 100));
  }, [book?.originalPrice, discountPercentageInput]);

  const sortedCovers = useMemo(() => {
    if (!book?.covers?.length) return [];

    return [...book.covers].sort((a, b) => {
      if (a.isPrimary === b.isPrimary) {
        return a.displayOrder - b.displayOrder;
      }

      return a.isPrimary ? -1 : 1;
    });
  }, [book]);

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
    sortedCovers.length > 0
      ? sortedCovers[0].url
      : 'https://tse1.mm.bing.net/th/id/OIP.dI055T7RdiMDYUAVQbp88AHaLX?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3';

  return (
    <div className="p-12 max-w-7xl mx-auto">
      {/* unchanged UI */}
      <div className="flex flex-col gap-6 mb-12">
        <BookFormNavigate label="Book Detail" />
        <BookDetailHeader
          book={book}
          action={<RefreshButton onRefresh={refetch} loading={loading} />}
        />
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
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setShowCoverModal(true)}
                className="w-full rounded-xl bg-[#c1ecd4] py-3 text-sm font-bold text-[#325947] hover:bg-[#b3dec6] transition-colors"
              >
                Add cover
              </button>
            </div>
            {showCoverModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
                <div className="w-full max-w-4xl rounded-3xl border border-[#dbe5dd] bg-white p-6 shadow-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#58615b]">
                      Cover list
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowCoverModal(false)}
                      className="rounded-lg border border-[#dbe5dd] px-3 py-1.5 text-xs font-semibold text-[#58615b] hover:bg-[#f7faf5]"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mb-6 rounded-2xl border border-[#edf2ee] bg-[#f8fbf9] p-4">
                    <p className="mb-3 text-xs font-semibold text-[#58615b]">
                      Upload new cover
                    </p>
                    <ImageUpload value={coverFile} onChange={setCoverFile} />
                    <button
                      type="button"
                      disabled={!coverFile || uploadingCover}
                      onClick={async () => {
                        if (!coverFile) return;
                        const nextDisplayOrder =
                          Math.max(
                            0,
                            ...(sortedCovers.map(
                              (cover) => cover.displayOrder,
                            ) ?? []),
                          ) + 1;
                        await handleAddCover(coverFile, nextDisplayOrder);
                        setCoverFile(null);
                      }}
                      className="mt-3 rounded-xl bg-[#c1ecd4] px-4 py-2 text-xs font-bold text-[#325947] hover:bg-[#b3dec6] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {uploadingCover ? 'Uploading...' : 'Upload cover'}
                    </button>
                  </div>

                  <div className="max-h-[48vh] overflow-x-auto overflow-y-auto">
                    <table className="min-w-full text-left text-sm text-[#2b352f]">
                      <thead>
                        <tr className="border-b border-[#dbe5dd] text-xs uppercase tracking-[0.12em] text-[#58615b]">
                          <th className="px-2 py-2 font-semibold">
                            Cover image
                          </th>
                          <th className="px-2 py-2 font-semibold">isPrimary</th>
                          <th className="px-2 py-2 font-semibold text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedCovers.length ? (
                          sortedCovers.map((cover, index) => (
                            <tr
                              key={`${cover.id}-${index}`}
                              className="border-b border-[#edf2ee] last:border-0"
                            >
                              <td className="px-2 py-3">
                                <div className="h-24 w-16 overflow-hidden rounded-md border border-[#dbe5dd] bg-[#f7faf5]">
                                  <img
                                    src={cover.url}
                                    alt={`Book cover ${index + 1}`}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-3">
                                {cover.isPrimary ? 'true' : 'false'}
                              </td>
                              <td className="px-2 py-3">
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleChangePrimaryCover(cover.id)
                                    }
                                    disabled={
                                      cover.isPrimary ||
                                      !!changingPrimaryCoverId ||
                                      !!deletingCoverId
                                    }
                                    className="rounded-lg border border-[#dbe5dd] bg-white px-3 py-1.5 text-xs font-semibold text-[#325947] hover:bg-[#f7faf5] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                                  >
                                    {changingPrimaryCoverId === cover.id
                                      ? 'Updating...'
                                      : cover.isPrimary
                                        ? 'Primary'
                                        : 'Make primary'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCover(cover.id)}
                                    disabled={
                                      !!deletingCoverId ||
                                      !!changingPrimaryCoverId
                                    }
                                    className="rounded-lg border border-[#fa746f]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#a83836] hover:bg-[#fff0f0] transition-colors inline-flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-70"
                                  >
                                    <Trash2 size={14} />
                                    {deletingCoverId === cover.id
                                      ? 'Deleting...'
                                      : 'Delete'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              className="px-2 py-4 text-center text-xs text-[#58615b]"
                            >
                              No covers available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
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
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          <BasicInformation book={book} onUpdated={refetch} />
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="rounded-3xl bg-[#f7faf5] p-8 shadow-sm border-l-4 border-[#3f6754]">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#58615b] mb-6">
                Unit price (VND)
              </h3>
              <div className="relative">
                <input
                  value={priceInput}
                  onChange={(event) =>
                    setPriceInput(event.target.value.replace(/\D/g, ''))
                  }
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleUpdatePrice();
                    }
                  }}
                  disabled={updatingPrice}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  title="Only numbers are allowed"
                  className="w-full rounded-3xl bg-white p-4 pl-5 text-base font-black text-[#2b352f] ring-1 ring-[#c1ecd4] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>
              <p className="mt-4 text-[10px] italic text-[#58615b]">
                Current price may change depending on active campaigns.
              </p>
            </div>
            <div className="rounded-3xl bg-[#f7faf5] p-8 shadow-sm border-l-4 border-[#a35f2a]">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#58615b] mb-6">
                Discount percentage
              </h3>
              <div className="relative">
                <input
                  value={discountPercentageInput}
                  onChange={(event) =>
                    setDiscountPercentageInput(
                      event.target.value.replace(/[^0-9.]/g, ''),
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleUpdateDiscountPercentage();
                    }
                  }}
                  disabled={updatingDiscountPercentage}
                  inputMode="decimal"
                  title="Enter a percentage from 0 to 100"
                  className="w-full rounded-3xl bg-white p-4 pl-5 pr-10 text-base font-black text-[#2b352f] ring-1 ring-[#f0d1b9] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                />
                <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-sm font-black text-[#8a4f21]">
                  %
                </span>
              </div>
              <p className="mt-4 text-[10px] italic text-[#58615b]">
                Sale price preview: {salePrice.toLocaleString('vi-VN')} VND
              </p>
            </div>
            <div className="rounded-3xl bg-[#f7faf5] p-8 shadow-sm border-l-4 border-[#3c6091]">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#58615b] mb-6">
                Stock quantity
              </h3>
              <div className="relative">
                <input
                  value={displayQuantity}
                  onChange={(event) =>
                    handleQuantityInputChange(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleUpdateQuantity();
                    }
                  }}
                  disabled={adjustingStock}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  title="Only numbers are allowed"
                  className="w-full rounded-3xl bg-white p-4 pl-5 text-base font-black text-[#2b352f] ring-1 ring-[#c1ecd4] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                />
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
