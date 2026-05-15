'use client';

import { useState } from 'react';
import { BookDetail } from '@/app/staff/books/types';
import { formStyles } from '@/shared/common/form/form-styles';
import { useToast } from '@/shared/common/toast/toast';
import { updateBookService } from '../../services/update-book.service';

export default function BasicInformation({ book }: { book: BookDetail }) {
  const { fieldStyle, inputClass, labelClass, labelStyle } = formStyles();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    isbn: book.isbn,
    publisher: book.publisher,
    pageCount: String(book.pageCount ?? ''),
    language: book.language,
    genres: book.genres.join(', '),
    authors: book.authors.join(', '),
    description: book.description ?? '',
  });

  const isReadOnly = !isEditing;

  const resetForm = () => {
    setFormData({
      isbn: book.isbn,
      publisher: book.publisher,
      pageCount: String(book.pageCount ?? ''),
      language: book.language,
      genres: book.genres.join(', '),
      authors: book.authors.join(', '),
      description: book.description ?? '',
    });
  };

  const handleSave = async () => {
    const normalizedPageCount = Number(formData.pageCount);
    if (Number.isNaN(normalizedPageCount)) {
      addToast('Page count must be a number.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      await updateBookService(book.id, {
        isbn: formData.isbn.trim(),
        publisher: formData.publisher.trim(),
        pageCount: normalizedPageCount,
        language: formData.language.trim(),
        genres: formData.genres
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        authors: formData.authors
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        description: formData.description.trim(),
      });
      setIsEditing(false);
      addToast('Saved successfully.', 'success');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save changes.';
      addToast(message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-3xl bg-white p-10 shadow-sm border border-[#dbe5dd]">
      <div className="mb-8 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-[#2b352f]">Basic Information</h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsEditing(false);
                }}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl border border-[#b8c5bd] bg-white px-5 py-2.5 text-sm font-bold text-[#58615b] transition-colors hover:bg-[#f4f7f5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#3f6754] px-5 py-2.5 text-sm font-bold text-[#e6ffef] transition-colors hover:bg-[#335b48] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#3f6754] px-5 py-2.5 text-sm font-bold text-[#e6ffef] transition-colors hover:bg-[#335b48]"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">
            ISBN
          </label>
          <input
            readOnly={isReadOnly}
            value={formData.isbn}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, isbn: event.target.value }))
            }
            className={inputClass}
            style={fieldStyle}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">
            Publisher
          </label>
          <input
            readOnly={isReadOnly}
            value={formData.publisher}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, publisher: event.target.value }))
            }
            className={inputClass}
            style={fieldStyle}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">
            Page count
          </label>
          <input
            readOnly={isReadOnly}
            value={formData.pageCount}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, pageCount: event.target.value }))
            }
            className={inputClass}
            style={fieldStyle}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">
            Language
          </label>
          <input
            readOnly={isReadOnly}
            value={formData.language}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, language: event.target.value }))
            }
            className={inputClass}
            style={fieldStyle}
          />
        </div>
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-3">
          <label className={labelClass} style={labelStyle}>
            Genre
          </label>
          <input
            readOnly={isReadOnly}
            value={formData.genres}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, genres: event.target.value }))
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
            readOnly={isReadOnly}
            value={formData.authors}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, authors: event.target.value }))
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
            readOnly={isReadOnly}
            value={formData.description}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, description: event.target.value }))
            }
            className={`${inputClass} h-48 resize-none leading-relaxed`}
            style={fieldStyle}
          />
        </div>
      </div>
    </section>
  );
}
