'use client';

import { useEffect, useState } from 'react';
import { BookDetail } from '@/app/staff/books/types';
import { formStyles } from '@/shared/common/form/form-styles';
import { useToast } from '@/shared/common/toast/toast';
import SearchSelect from '@/shared/common/components/input-select/search-select';
import TagPicker from '@/shared/common/components/input-select/tag-picker';
import { allAuthorService } from '@/app/admin/authors/(author-management)/services/all-author.service';
import { allGenreService } from '@/app/admin/genres/(genre-management)/services/all-genre.service';
import { allPublisherService } from '@/app/admin/publishers/(publisher-management)/services/all-publisher.service';
import { allLanguageService } from '@/app/admin/languages/(language-management)/services/all-language.service';
import { updateBookService } from '../../services/update-book.service';

type SelectOption = { id: string; name: string };

export default function BasicInformation({
  book,
  onUpdated,
}: {
  book: BookDetail;
  onUpdated?: () => void;
}) {
  const { fieldStyle, inputClass, labelClass, labelStyle } = formStyles();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [authorOptions, setAuthorOptions] = useState<SelectOption[]>([]);
  const [genreOptions, setGenreOptions] = useState<SelectOption[]>([]);
  const [publisherOptions, setPublisherOptions] = useState<SelectOption[]>([]);
  const [languageOptions, setLanguageOptions] = useState<SelectOption[]>([]);

  const [formData, setFormData] = useState({
    isbn: book.isbn,
    title: book.title,
    publisherId: '',
    pageCount: String(book.pageCount ?? ''),
    languageId: '',
    genreIds: [] as string[],
    authorIds: [] as string[],
    description: book.description ?? '',
  });

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [authorsRes, genresRes, publishersRes, languagesRes] =
          await Promise.all([
            allAuthorService(1, 1000, ''),
            allGenreService(1, 1000, ''),
            allPublisherService(1, 1000, ''),
            allLanguageService(1, 1000, ''),
          ]);

        setAuthorOptions(authorsRes?.authors || []);
        setGenreOptions(genresRes?.genres || []);
        setPublisherOptions(publishersRes?.publishers || []);
        setLanguageOptions(languagesRes?.languages || []);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to load form options';
        addToast(message, 'error');
      }
    };

    fetchFilterOptions();
  }, [addToast]);

  const resetForm = () => {
    setFormData({
      isbn: book.isbn,
      title: book.title,
      publisherId:
        publisherOptions.find((item) => item.name === book.publisher)?.id || '',
      pageCount: String(book.pageCount ?? ''),
      languageId:
        languageOptions.find((item) => item.name === book.language)?.id || '',
      genreIds: genreOptions
        .filter((item) => book.genres.includes(item.name))
        .map((item) => item.id),
      authorIds: authorOptions
        .filter((item) => book.authors.includes(item.name))
        .map((item) => item.id),
      description: book.description ?? '',
    });
  };

  const handleSave = async () => {
    const normalizedPageCount = Number(formData.pageCount);
    if (Number.isNaN(normalizedPageCount)) {
      addToast('Page count must be a number.', 'error');
      return;
    }

    if (!formData.publisherId || !formData.languageId) {
      addToast('Publisher and language are required.', 'error');
      return;
    }

    if (formData.genreIds.length === 0 || formData.authorIds.length === 0) {
      addToast('Genres and authors are required.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      await updateBookService(book.id, {
        isbn: formData.isbn.trim(),
        title: formData.title.trim(),
        publisherId: formData.publisherId,
        pageCount: normalizedPageCount,
        languageId: formData.languageId,
        genreIds: formData.genreIds,
        authorIds: formData.authorIds,
        description: formData.description.trim(),
      });
      setIsEditing(false);
      addToast('Saved successfully.', 'success');
      onUpdated?.();
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
              onClick={() => {
                resetForm();
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#3f6754] px-5 py-2.5 text-sm font-bold text-[#e6ffef] transition-colors hover:bg-[#335b48]"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      {isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">
              ISBN
            </label>
            <input
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
              Page count
            </label>
            <input
              value={formData.pageCount}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  pageCount: event.target.value,
                }))
              }
              className={inputClass}
              style={fieldStyle}
            />
          </div>
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-3">
            <label className={labelClass} style={labelStyle}>
              Publisher
            </label>
            <SearchSelect
              options={publisherOptions}
              value={formData.publisherId}
              onChange={(id) =>
                setFormData((prev) => ({ ...prev, publisherId: id }))
              }
              placeholder="Select a publisher"
              inputClassName={inputClass}
              inputStyle={fieldStyle}
            />
          </div>
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-3">
            <label className={labelClass} style={labelStyle}>
              Language
            </label>
            <SearchSelect
              options={languageOptions}
              value={formData.languageId}
              onChange={(id) =>
                setFormData((prev) => ({ ...prev, languageId: id }))
              }
              placeholder="Select a language"
              inputClassName={inputClass}
              inputStyle={fieldStyle}
            />
          </div>
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-3">
            <label className={labelClass} style={labelStyle}>
              Genre
            </label>
            <TagPicker
              options={genreOptions}
              selected={formData.genreIds}
              onChange={(ids) =>
                setFormData((prev) => ({ ...prev, genreIds: ids }))
              }
              placeholder="Search genres..."
              inputClassName={inputClass}
              inputStyle={fieldStyle}
            />
          </div>
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-3">
            <label className={labelClass} style={labelStyle}>
              Author
            </label>
            <TagPicker
              options={authorOptions}
              selected={formData.authorIds}
              onChange={(ids) =>
                setFormData((prev) => ({ ...prev, authorIds: ids }))
              }
              placeholder="Search authors..."
              inputClassName={inputClass}
              inputStyle={fieldStyle}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-3">
            <label className={labelClass} style={labelStyle}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              className={`${inputClass} h-48 resize-none leading-relaxed`}
              style={fieldStyle}
            />
          </div>
        </div>
      ) : (
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
      )}
    </section>
  );
}
