'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/shared/common/toast/toast';
import { uploadBookCoverService } from '../../create/services/create-book-service';
import ImageUpload from '@/shared/common/components/image-upload/image-upload';
import {
  addBookCoverService,
  adjustBookStockService,
  findOneBookService,
  removeBookCoverService,
  updateBookPriceService,
  updateBookService,
} from '../services/edit-book.service';

export default function EditBookForm({ bookId }: { bookId: string }) {
  const { addToast } = useToast();
  const [book, setBook] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const loadBook = async () => {
    try {
      const data = await findOneBookService(bookId);
      setBook(data);
      setTitle(data?.title || '');
      setDescription(data?.description || '');
      setPrice(String(data?.originalPrice ?? ''));
      setStock(String(data?.quantity ?? ''));
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to load book', 'error');
    }
  };

  useEffect(() => {
    loadBook();
  }, [bookId]);

  const onSaveDetail = async () => {
    try {
      await updateBookService(bookId, {
        ...book,
        title,
        description,
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
      await addBookCoverService(bookId, coverUrl);
      setCoverFile(null);
      addToast('Added book cover successfully', 'success');
      loadBook();
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to add cover', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-6 border space-y-4">
        <h3 className="font-semibold">Basic Information</h3>
        <input className="w-full border rounded-lg p-3" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book title" />
        <textarea className="w-full border rounded-lg p-3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <button onClick={onSaveDetail} className="px-4 py-2 rounded-full bg-[#2d6a4f] text-white">Update Book</button>
      </div>

      <div className="bg-white rounded-xl p-6 border space-y-4">
        <h3 className="font-semibold">Price & Stock</h3>
        <div className="flex gap-3">
          <input className="border rounded-lg p-3" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
          <button onClick={onUpdatePrice} className="px-4 py-2 rounded-full bg-[#2d6a4f] text-white">Update Price</button>
        </div>
        <div className="flex gap-3">
          <input className="border rounded-lg p-3" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock quantity" />
          <button onClick={onAdjustStock} className="px-4 py-2 rounded-full bg-[#2d6a4f] text-white">Adjust Stock</button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border space-y-4">
        <h3 className="font-semibold">Book Covers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(book?.covers || []).map((cover: any) => (
            <div key={cover.id} className="border rounded-lg p-2">
              <img src={cover.url} alt="cover" className="h-40 w-full object-cover rounded" />
              <button
                onClick={() => removeBookCoverService(bookId, cover.id).then(loadBook)}
                className="mt-2 text-sm text-red-600"
              >
                Remove cover
              </button>
            </div>
          ))}
        </div>

        <ImageUpload value={coverFile} onChange={(file) => setCoverFile(file)} />
        <button onClick={onAddCover} className="px-4 py-2 rounded-full bg-[#2d6a4f] text-white">Add Book Cover</button>
      </div>
    </div>
  );
}
