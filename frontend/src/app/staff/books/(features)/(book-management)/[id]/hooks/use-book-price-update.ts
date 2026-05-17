import { useEffect, useState } from 'react';
import { useToast } from '@/shared/common/toast/toast';
import { updateBookPriceService } from '../../services/update-book-price.service';
import { BookDetail } from '@/app/staff/books/types';

interface UseBookPriceUpdateProps {
  book: BookDetail | null;
  bookId: string;
  refetch: () => Promise<void>;
}

export default function useBookPriceUpdate({
  book,
  bookId,
  refetch,
}: UseBookPriceUpdateProps) {
  const { addToast } = useToast();
  const [updatingPrice, setUpdatingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState('');

  useEffect(() => {
    if (book) {
      setPriceInput(String(book.originalPrice ?? ''));
    }
  }, [book]);

  const handleUpdatePrice = async () => {
    if (!book || updatingPrice) return;

    const raw = (priceInput || '').trim();
    const nextPrice = Number(raw.replace(/[,\s]/g, ''));

    if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
      addToast('Please enter a valid price greater than 0.', 'error');
      return;
    }

    try {
      setUpdatingPrice(true);
      await updateBookPriceService(bookId, { price: nextPrice });
      await refetch();
      addToast('Book price updated successfully.', 'success');
    } catch (error) {
      addToast(
        error instanceof Error
          ? error.message
          : 'Failed to update price. Please try again.',
        'error',
      );
    } finally {
      setUpdatingPrice(false);
    }
  };

  return {
    updatingPrice,
    priceInput,
    setPriceInput,
    handleUpdatePrice,
  };
}
