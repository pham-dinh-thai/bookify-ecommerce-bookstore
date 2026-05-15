import { BookDetail } from '@/app/staff/books/types';
import { formStyles } from '@/shared/common/form/form-styles';
import Link from 'next/link';

export default function BasicInformation({ book }: { book: BookDetail }) {
  const { fieldStyle, inputClass, labelClass, labelStyle } = formStyles();

  return (
    <section className="rounded-3xl bg-white p-10 shadow-sm border border-[#dbe5dd]">
      <div className="mb-8 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-[#2b352f]">Basic Information</h2>
        <Link
          href={`/staff/books/${book.id}/edit`}
          className="inline-flex items-center gap-2 rounded-xl bg-[#3f6754] px-5 py-2.5 text-sm font-bold text-[#e6ffef] transition-colors hover:bg-[#335b48]"
        >
          Edit
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">
            ISBN
          </label>
          <input
            readOnly
            value={book.isbn}
            className={inputClass}
            style={fieldStyle}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">
            Publisher
          </label>
          <input
            readOnly
            value={book.publisher}
            className={inputClass}
            style={fieldStyle}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">
            Page count
          </label>
          <input
            readOnly
            value={book.pageCount}
            className={inputClass}
            style={fieldStyle}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">
            Language
          </label>
          <input
            readOnly
            value={book.language}
            className={inputClass}
            style={fieldStyle}
          />
        </div>
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-3">
          <label className={labelClass} style={labelStyle}>
            Genre
          </label>
          <input
            readOnly
            value={
              book.genres.length > 0
                ? book.genres.join(', ')
                : 'No genres available'
            }
            className={inputClass}
            style={fieldStyle}
          />
        </div>

        <div className="col-span-1 lg:col-span-2 flex flex-col gap-3">
          <label className={labelClass} style={labelStyle}>
            Author
          </label>
          <input
            readOnly
            value={
              book.authors.length > 0
                ? book.authors.join(', ')
                : 'No authors available'
            }
            className={inputClass}
            style={fieldStyle}
          />
        </div>

        <div className="col-span-2 flex flex-col gap-3">
          <label className={labelClass} style={labelStyle}>
            Description
          </label>
          <textarea
            readOnly
            value={book.description}
            className={`${inputClass} h-48 resize-none leading-relaxed`}
            style={fieldStyle}
          />
        </div>
      </div>
    </section>
  );
}
