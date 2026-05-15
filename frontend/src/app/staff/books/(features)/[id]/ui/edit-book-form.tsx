'use client';

import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/shared/common/toast/toast';
import { uploadBookCoverService } from '../../create/services/create-book-service';
import ImageUpload from '@/shared/common/components/image-upload/image-upload';
import {
  addBookCoverService,
  adjustBookStockService,
  BookCoverItem,
  BookDetailResponse,
  findOneBookService,
  removeBookCoverService,
  updateBookPriceService,
  updateBookService,
} from '../services/edit-book.service';

type UpdateFormState = {
  isbn: string;
  title: string;
  description: string;
  pageCount: string;
  publisherId: string;
  languageId: string;
  authorIds: string;
  genreIds: string;
};

export default function EditBookForm({ bookId }: { bookId: string }) {
  const { addToast } = useToast();
  const [book, setBook] = useState<BookDetailResponse | null>(null);
  const [form, setForm] = useState<UpdateFormState>({
    isbn: '', title: '', description: '', pageCount: '', publisherId: '', languageId: '', authorIds: '', genreIds: '',
  });
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const loadBook = useCallback(async () => {
    try {
      const data = await findOneBookService(bookId);
      if (!data) throw new Error('Book not found');
      setBook(data);
      setForm({
        isbn: data.isbn ?? '',
        title: data.title ?? '',
        description: data.description ?? '',
        pageCount: String(data.pageCount ?? ''),
        publisherId: data.publisherId ?? '',
        languageId: data.languageId ?? '',
        authorIds: (data.authorIds ?? []).join(', '),
        genreIds: (data.genreIds ?? []).join(', '),
      });
      setPrice(String(data.originalPrice ?? ''));
      setStock(String(data.quantity ?? ''));
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to load book', 'error');
    }
  }, [addToast, bookId]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  const splitIds = (value: string) => value.split(',').map((x) => x.trim()).filter(Boolean);

  const onSaveDetail = async () => {
    try {
      await updateBookService(bookId, {
        isbn: form.isbn,
        title: form.title,
        description: form.description,
        pageCount: Number(form.pageCount),
        publisherId: form.publisherId,
        languageId: form.languageId,
        authorIds: splitIds(form.authorIds),
        genreIds: splitIds(form.genreIds),
      });
      addToast('Updated book detail successfully', 'success');
      loadBook();
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to update details', 'error');
    }
  };

  const onUpdatePrice = async () => {
    try {
      await updateBookPriceService(bookId, Number(price));
      addToast('Updated book price successfully', 'success');
      loadBook();
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to update price', 'error');
    }
  };

  const onAdjustStock = async () => {
    try {
      await adjustBookStockService(bookId, Number(stock));
      addToast('Adjusted stock successfully', 'success');
      loadBook();
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to adjust stock', 'error');
    }
  };

  const onAddCover = async () => {
    if (!coverFile) return;
    try {
      const coverUrl = await uploadBookCoverService(coverFile);
      const displayOrder = (book?.covers?.length ?? 0) + 1;
      await addBookCoverService(bookId, coverUrl, displayOrder);
      setCoverFile(null);
      addToast('Added book cover successfully', 'success');
      loadBook();
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to add cover', 'error');
    }
  };

  return <div className="space-y-8">
    <div className="bg-white rounded-xl p-6 border space-y-3">
      <h3 className="font-semibold">Basic Information</h3>
      {(['isbn','title','description','pageCount','publisherId','languageId','authorIds','genreIds'] as const).map((key) => (
        <input key={key} className="w-full border rounded-lg p-3" value={form[key]} onChange={(e)=>setForm((p)=>({...p,[key]:e.target.value}))} placeholder={key} />
      ))}
      <button onClick={onSaveDetail} className="px-4 py-2 rounded-full bg-[#2d6a4f] text-white">Update Book</button>
    </div>
    <div className="bg-white rounded-xl p-6 border space-y-3">
      <h3 className="font-semibold">Price & Stock</h3>
      <div className="flex gap-3"><input className="border rounded-lg p-3" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="price" /><button onClick={onUpdatePrice} className="px-4 py-2 rounded-full bg-[#2d6a4f] text-white">Update Price</button></div>
      <div className="flex gap-3"><input className="border rounded-lg p-3" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="quantity" /><button onClick={onAdjustStock} className="px-4 py-2 rounded-full bg-[#2d6a4f] text-white">Adjust Stock</button></div>
    </div>
    <div className="bg-white rounded-xl p-6 border space-y-4">
      <h3 className="font-semibold">Book Covers</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(book?.covers || []).map((cover: BookCoverItem) => <div key={cover.id} className="border rounded-lg p-2"><img src={cover.url} alt="cover" className="h-40 w-full object-cover rounded" /><button onClick={() => removeBookCoverService(bookId, cover.id).then(loadBook)} className="mt-2 text-sm text-red-600">Remove cover</button></div>)}
      </div>
      <ImageUpload value={coverFile} onChange={(file) => setCoverFile(file)} />
      <button onClick={onAddCover} className="px-4 py-2 rounded-full bg-[#2d6a4f] text-white">Add Book Cover</button>
    </div>
  </div>;
}
