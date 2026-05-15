'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import useBookDetail from '../hooks/use-book-detail';
import { useToast } from '@/shared/common/toast/toast';
import BookFormNavigate from '../../../components/book-form-navigate';

export default function ViewBookDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { book, loading, errors } = useBookDetail(id);
  const { addToast } = useToast();

  const statusLabel = useMemo(() => {
    if (!book) return 'Unknown';
    return book.isInStock ? 'Đang kinh doanh' : 'Hết hàng';
  }, [book]);

  if (loading) {
    return (
      <div className="p-12 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-white p-12 shadow-sm border border-slate-200 animate-pulse h-[600px]" />
      </div>
    );
  }

  if (errors || !book) {
    return (
      <div className="p-12 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-white p-12 shadow-sm border border-slate-200">
          <p className="text-base text-red-600">
            Không thể tải thông tin sách. Vui lòng thử lại.
          </p>
          <Link
            href="/staff/books"
            className="mt-4 inline-flex items-center rounded-full bg-[#2d6a4f] px-4 py-3 text-sm font-semibold text-white hover:bg-[#23543f] transition-colors"
          >
            Quay lại danh sách sách
          </Link>
        </div>
      </div>
    );
  }

  const coverUrl =
    book.covers && book.covers.length > 0
      ? book.covers[0].url
      : 'https://tse1.mm.bing.net/th/id/OIP.dI055T7RdiMDYUAVQbp88AHaLX?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3';

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6 mb-12">
        <BookFormNavigate label="Book Detail" />

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-5xl font-black tracking-tighter leading-none text-[#2b352f] mb-3">
              {book.title}
            </h1>
            <p className="text-xl font-medium text-[#58615b]">
              {book.authors.join(', ')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="rounded-3xl bg-[#f7faf5] p-6 shadow-sm border border-[#dbe5dd] group">
            <div className="relative aspect-[2/3] rounded-[1.5rem] overflow-hidden bg-[#e8f0e9] mb-6">
              <img
                src={coverUrl}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                <button className="w-12 h-12 rounded-full bg-white text-[#335b48] shadow-lg hover:scale-110 transition-transform flex items-center justify-center">
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="w-12 h-12 rounded-full bg-white text-[#a83836] shadow-lg hover:scale-110 transition-transform flex items-center justify-center">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button className="w-full rounded-xl bg-[#c1ecd4] py-3 text-sm font-bold text-[#325947] hover:bg-[#b3dec6] transition-colors">
                Cập nhật bìa sách
              </button>
              <button className="w-full rounded-xl border border-[#fa746f]/20 bg-white py-3 text-sm font-semibold text-[#a83836] hover:bg-[#fff0f0] transition-colors">
                Xóa bìa hiện tại
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-[#f7faf5] p-6 shadow-sm border border-[#dbe5dd]">
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[#58615b] mb-4">
              Trạng thái lưu trữ
            </h2>
            <div className="flex items-center justify-between rounded-3xl border border-[#aab4ad]/15 bg-white p-4">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#3f6754] animate-pulse" />
                <span className="font-semibold text-[#2b352f]">
                  {statusLabel}
                </span>
              </div>
              <span className="material-symbols-outlined text-[#58615b]">
                sync
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          <section className="rounded-3xl bg-[#f7faf5] p-10 shadow-sm border border-[#dbe5dd]">
            <h2 className="text-2xl font-bold text-[#2b352f] mb-8">
              Thông tin cơ bản
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">
                  Mã ISBN-13
                </label>
                <input
                  readOnly
                  value={book.isbn}
                  className="rounded-3xl bg-white p-4 text-sm font-medium text-[#2b352f] ring-1 ring-[#c1ecd4] focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">
                  Nhà xuất bản
                </label>
                <input
                  readOnly
                  value={book.publisher}
                  className="rounded-3xl bg-white p-4 text-sm font-medium text-[#2b352f] ring-1 ring-[#c1ecd4] focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">
                  Số trang
                </label>
                <input
                  readOnly
                  value={book.pageCount}
                  className="rounded-3xl bg-white p-4 text-sm font-medium text-[#2b352f] ring-1 ring-[#c1ecd4] focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">
                  Ngôn ngữ
                </label>
                <input
                  readOnly
                  value={book.language}
                  className="rounded-3xl bg-white p-4 text-sm font-medium text-[#2b352f] ring-1 ring-[#c1ecd4] focus:outline-none"
                />
              </div>
              <div className="col-span-1 lg:col-span-2 flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">
                  Thể loại
                </label>
                <div className="flex flex-wrap gap-2 rounded-3xl bg-white p-4 ring-1 ring-[#c1ecd4]">
                  {book.genres.length > 0 ? (
                    book.genres.map((genre) => (
                      <span
                        key={genre}
                        className="inline-flex items-center gap-2 rounded-full bg-[#3f6754] px-4 py-2 text-xs font-bold text-[#e6ffef]"
                      >
                        {genre}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[#58615b]">
                      Chưa có thể loại
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-3xl bg-[#f7faf5] p-8 shadow-sm border-l-4 border-[#3f6754]">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#58615b] mb-6">
                Đơn giá (VND)
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#58615b]">
                    ₫
                  </span>
                  <input
                    readOnly
                    value={book.originalPrice.toLocaleString('vi-VN')}
                    className="w-full rounded-3xl bg-white p-4 pl-10 text-xl font-black text-[#2b352f] ring-1 ring-[#c1ecd4] focus:outline-none"
                  />
                </div>
                <button className="h-14 w-14 rounded-3xl bg-[#c1ecd4] text-[#325947] transition-colors hover:bg-[#b3dec6] flex items-center justify-center">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    trending_up
                  </span>
                </button>
              </div>
              <p className="mt-4 text-[10px] italic text-[#58615b]">
                Giá hiện tại có thể thay đổi tùy chiến dịch.
              </p>
            </div>

            <div className="rounded-3xl bg-[#f7faf5] p-8 shadow-sm border-l-4 border-[#3c6091]">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#58615b] mb-6">
                Số lượng tồn kho
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex h-14 flex-1 items-center justify-between overflow-hidden rounded-3xl bg-white ring-1 ring-[#c1ecd4]">
                  <button className="h-full w-14 transition-colors hover:bg-[#f1f1f1]">
                    <span className="material-symbols-outlined text-[#2b352f]">
                      remove
                    </span>
                  </button>
                  <input
                    readOnly
                    value={book.quantity}
                    className="w-full border-none bg-transparent text-center text-xl font-black text-[#2b352f] focus:outline-none"
                  />
                  <button className="h-full w-14 transition-colors hover:bg-[#f1f1f1]">
                    <span className="material-symbols-outlined text-[#2b352f]">
                      add
                    </span>
                  </button>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#d4e3ff] text-[#2d5383]">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    inventory
                  </span>
                </div>
              </div>
              <p className="mt-4 text-[10px] italic text-[#58615b]">
                Mức tồn kho:{' '}
                {book.quantity > 50
                  ? 'Cao'
                  : book.quantity > 10
                    ? 'Trung bình'
                    : 'Thấp'}
              </p>
            </div>
          </section>

          <section className="rounded-3xl bg-[#f7faf5] p-10 shadow-sm border border-[#dbe5dd]">
            <h2 className="text-2xl font-bold text-[#2b352f] mb-6">
              Mô tả tác phẩm
            </h2>
            <textarea
              readOnly
              value={book.description}
              className="h-48 w-full resize-none rounded-3xl bg-white p-6 text-sm leading-relaxed text-[#58615b] ring-1 ring-[#c1ecd4] focus:outline-none"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
