'use client';

import { useState } from 'react';
import CreateBookAction from './create-book-action';
import { createBookService } from '../services/create-book-service';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/common/toast/toast';
import { formStyles } from '@/shared/common/form/form-styles';
import { validateBookForm } from '../services/use-book-validate';
import {
  CreateBookForm as CreateBook,
  CreateBookFormErrors,
} from '../../../types';
import TagPicker from '@/shared/common/components/input-select/tag-picker';
import ImageUpload from '@/shared/common/components/image-upload/image-upload';
import SearchSelect from '@/shared/common/components/input-select/search-select';

// Thay coverUrl string → File | null trong form state
type CreateBookFormState = Omit<CreateBook, 'coverUrl'> & {
  coverFile: File | null;
};

type CreateBookFormErrorsExtended = Omit<CreateBookFormErrors, 'coverUrl'> & {
  coverFile?: string;
};

const PUBLISHERS = [
  { id: 'pub-1', name: 'Publisher 1' },
  { id: 'pub-2', name: 'Publisher 2' },
  { id: 'pub-3', name: 'Publisher 3' },
];

const LANGUAGES = [
  { id: 'en', name: 'English' },
  { id: 'vi', name: 'Vietnamese' },
  { id: 'fr', name: 'French' },
  { id: 'ja', name: 'Japanese' },
];

export default function CreateBookForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateBookFormState>({
    isbn: '',
    title: '',
    description: '',
    originalPrice: 0,
    quantity: 0,
    authorIds: [],
    publisherId: '',
    genreIds: [],
    languageId: '',
    pageCount: 0,
    coverFile: null,
  });

  const [errors, setErrors] = useState<CreateBookFormErrorsExtended>({});
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'originalPrice' || name === 'quantity' || name === 'pageCount'
          ? Number(value)
          : value,
    }));
    if (errors[name as keyof CreateBookFormErrorsExtended]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const { fieldStyle, inputClass, labelClass, labelStyle } = formStyles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate coverFile
    const newErrors: CreateBookFormErrorsExtended = validateBookForm({
      ...formData,
      coverUrl: formData.coverFile ? 'filled' : '', // tạm để pass validator cũ
    }) as CreateBookFormErrorsExtended;

    delete (newErrors as any).coverUrl;
    if (!formData.coverFile) {
      newErrors.coverFile = 'Cover image is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);

      // Upload file → lấy URL trước (hoặc gửi kèm FormData tuỳ API)
      // Ví dụ: const coverUrl = await uploadCoverFile(formData.coverFile!);
      // Rồi: await createBookService({ ...formData, coverUrl });

      await createBookService({
        ...formData,
        coverUrl: '', // thay bằng URL sau khi upload
      } as CreateBook);

      addToast('Book created successfully', 'success');
      router.push('/staff/books');
    } catch (err: unknown) {
      let message = 'Something went wrong';
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        message = String((err as any).message);
      }
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8"
    >
      {/* Title */}
      <div className="space-y-3 md:col-span-2">
        <label className={labelClass} style={labelStyle}>
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. The Great Gatsby"
          className={inputClass}
          style={fieldStyle}
        />
        {errors.title && (
          <p className="text-sm text-red-500 ml-1">{errors.title}</p>
        )}
      </div>

      {/* ISBN */}
      <div className="space-y-3">
        <label className={labelClass} style={labelStyle}>
          ISBN
        </label>
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          placeholder="978-1-234567-89-0"
          className={inputClass}
          style={fieldStyle}
        />
        {errors.isbn && (
          <p className="text-sm text-red-500 ml-1">{errors.isbn}</p>
        )}
      </div>

      {/* Page Count */}
      <div className="space-y-3">
        <label className={labelClass} style={labelStyle}>
          Page Count
        </label>
        <input
          type="text"
          name="pageCount"
          value={formData.pageCount}
          onChange={handleChange}
          placeholder="300"
          className={inputClass}
          style={fieldStyle}
        />
        {errors.pageCount && (
          <p className="text-sm text-red-500 ml-1">{errors.pageCount}</p>
        )}
      </div>

      {/* Authors */}
      <div className="space-y-3">
        <label className={labelClass} style={labelStyle}>
          Author
        </label>
        <TagPicker
          options={[
            { id: 'author-1', name: 'Author 1' },
            { id: 'author-2', name: 'Author 2' },
            { id: 'author-3', name: 'Author 3' },
            { id: 'author-4', name: 'Author 4' },
            { id: 'author-5', name: 'Author 5' },
            { id: 'author-6', name: 'Author 6' },
            { id: 'author-7', name: 'Author 7' },
          ]}
          selected={formData.authorIds}
          onChange={(ids) =>
            setFormData((prev) => ({ ...prev, authorIds: ids }))
          }
          placeholder="Search authors..."
          inputClassName={inputClass}
          inputStyle={fieldStyle}
        />
      </div>

      {/* Genres */}
      <div className="space-y-3">
        <label className={labelClass} style={labelStyle}>
          Genre
        </label>
        <TagPicker
          options={[
            { id: 'genre-1', name: 'Fiction' },
            { id: 'genre-2', name: 'Non-Fiction' },
          ]}
          selected={formData.genreIds}
          onChange={(ids) =>
            setFormData((prev) => ({ ...prev, genreIds: ids }))
          }
          placeholder="Search genres..."
          inputClassName={inputClass}
          inputStyle={fieldStyle}
        />
      </div>

      {/* Publisher — SearchSelect */}
      <div className="space-y-3">
        <label className={labelClass} style={labelStyle}>
          Publisher
        </label>
        <SearchSelect
          options={PUBLISHERS}
          value={formData.publisherId}
          onChange={(id) => {
            setFormData((prev) => ({ ...prev, publisherId: id }));
            if (errors.publisherId)
              setErrors((prev) => ({ ...prev, publisherId: undefined }));
          }}
          placeholder="Select a publisher"
          inputClassName={inputClass}
          inputStyle={fieldStyle}
        />
        {errors.publisherId && (
          <p className="text-sm text-red-500 ml-1">{errors.publisherId}</p>
        )}
      </div>

      {/* Language — SearchSelect */}
      <div className="space-y-3">
        <label className={labelClass} style={labelStyle}>
          Language
        </label>
        <SearchSelect
          options={LANGUAGES}
          value={formData.languageId}
          onChange={(id) => {
            setFormData((prev) => ({ ...prev, languageId: id }));
            if (errors.languageId)
              setErrors((prev) => ({ ...prev, languageId: undefined }));
          }}
          placeholder="Select a language"
          inputClassName={inputClass}
          inputStyle={fieldStyle}
        />
        {errors.languageId && (
          <p className="text-sm text-red-500 ml-1">{errors.languageId}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-3 md:col-span-2">
        <label className={labelClass} style={labelStyle}>
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Book description..."
          className={`${inputClass} resize-none`}
          style={fieldStyle}
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-red-500 ml-1">{errors.description}</p>
        )}
      </div>

      {/* Original Price */}
      <div className="space-y-3">
        <label className={labelClass} style={labelStyle}>
          Original Price
        </label>
        <input
          type="text"
          name="originalPrice"
          value={formData.originalPrice}
          onChange={handleChange}
          placeholder="29.99"
          className={inputClass}
          style={fieldStyle}
        />
        {errors.originalPrice && (
          <p className="text-sm text-red-500 ml-1">{errors.originalPrice}</p>
        )}
      </div>

      {/* Quantity */}
      <div className="space-y-3">
        <label className={labelClass} style={labelStyle}>
          Quantity
        </label>
        <input
          type="text"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="100"
          className={inputClass}
          style={fieldStyle}
        />
        {errors.quantity && (
          <p className="text-sm text-red-500 ml-1">{errors.quantity}</p>
        )}
      </div>

      {/* Cover Image Upload — thay thế Cover URL */}
      <div className="space-y-3 md:col-span-2">
        <label className={labelClass} style={labelStyle}>
          Cover Image
        </label>
        <ImageUpload
          value={formData.coverFile}
          onChange={(file) => {
            setFormData((prev) => ({ ...prev, coverFile: file }));
            if (errors.coverFile)
              setErrors((prev) => ({ ...prev, coverFile: undefined }));
          }}
          error={errors.coverFile}
        />
      </div>

      <CreateBookAction
        setErrors={setErrors as any}
        setFormData={setFormData as any}
        isLoading={isLoading}
      />
    </form>
  );
}
