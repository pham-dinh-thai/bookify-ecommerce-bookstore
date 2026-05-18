'use client';

import { useEffect, useMemo } from 'react';
import SearchSelect from '@/shared/common/components/input-select/search-select';
import useImportStock from '../hooks/use-import-stock';

export default function ImportStockScreen() {
  const {
    books,
    selectedBookId,
    setSelectedBookId,
    quantity,
    setQuantity,
    selectedBook,
    selectedBookDetail,
    loadingBookDetail,
    loadingBooks,
    importing,
    canImport,
    loadBooks,
    importStock,
  } = useImportStock();

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const bookOptions = useMemo(
    () =>
      books.map((book) => ({
        id: book.id,
        name: `${book.title}${book.authors?.length ? ` — ${book.authors.join(', ')}` : ''}`,
      })),
    [books],
  );

  return (
    <div className="p-12">
      <div className="flex items-end justify-between mb-6">
        <h2
          className="text-5xl font-extrabold tracking-tighter leading-[1.1]"
          style={{ color: '#2b352f' }}
        >
          <span className="italic" style={{ color: '#335b48' }}>
            Import Book Stock
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:items-start">
        <div className="rounded-2xl border border-[#d8e6da] bg-white p-6 shadow-[0_8px_30px_rgba(34,53,43,0.07)]">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#3d5747]">
                Book
              </label>
              <SearchSelect
                options={bookOptions}
                value={selectedBookId}
                onChange={setSelectedBookId}
                placeholder={
                  loadingBooks ? 'Loading books...' : 'Search book...'
                }
                inputClassName="h-12 rounded-xl border border-[#c9dbcc] bg-[#f8fcf8] px-4 text-sm text-[#22352b] outline-none focus:border-[#2d6a4f]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3d5747]">
                Quantity to import
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="h-12 w-full rounded-xl border border-[#c9dbcc] bg-[#f8fcf8] px-4 text-sm text-[#22352b] outline-none focus:border-[#2d6a4f]"
              />
            </div>

            {selectedBook && (
              <div className="rounded-xl border border-[#e3eee4] bg-[#f7fbf7] p-4 text-sm text-[#405a4a]">
                Selected:{' '}
                <span className="font-semibold">{selectedBook.title}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                disabled={!canImport || loadingBooks}
                onClick={importStock}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#2d6a4f] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#24553f] disabled:cursor-not-allowed disabled:bg-[#9ab7a2]"
              >
                {importing ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-48 rounded-2xl border border-[#d8e6da] bg-white p-6 shadow-[0_8px_30px_rgba(34,53,43,0.07)]">
          {!selectedBookId && (
            <p className="text-sm text-[#5a6d60]">
              Select a book to view detailed information.
            </p>
          )}

          {selectedBookId && loadingBookDetail && (
            <p className="text-sm text-[#5a6d60]">
              Loading book information...
            </p>
          )}

          {selectedBookId && !loadingBookDetail && selectedBookDetail && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#22352b]">
                Book Detail
              </h2>

              <div className="flex gap-4">
                <div className="h-40 w-30 shrink-0 overflow-hidden border border-[#e3eee4] bg-[#f7fbf7]">
                  {selectedBookDetail.covers?.[0]?.url ? (
                    <img
                      src={selectedBookDetail.covers[0].url}
                      alt={selectedBookDetail.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-[#8aa091]">
                      No cover
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm text-[#405a4a]">
                  <p>
                    <span className="font-semibold text-[#22352b]">ISBN:</span>{' '}
                    {selectedBookDetail.isbn || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold text-[#22352b]">Title:</span>{' '}
                    {selectedBookDetail.title}
                  </p>
                  <p>
                    <span className="font-semibold text-[#22352b]">
                      Author:
                    </span>{' '}
                    {selectedBookDetail.authors?.join(', ') || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold text-[#22352b]">
                      Publisher:
                    </span>{' '}
                    {selectedBookDetail.publisher || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold text-[#22352b]">
                      Quantity:
                    </span>{' '}
                    {selectedBookDetail.quantity || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold text-[#22352b]">Price:</span>{' '}
                    {selectedBookDetail.originalPrice || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
