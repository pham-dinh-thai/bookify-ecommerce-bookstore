import { useEffect, useState } from 'react';
import { useToast } from '@/shared/common/toast/toast';
import { BookDetail } from '@/app/staff/books/types';
import { updateBookDiscountPercentageService } from '../../services/update-book-discount-percentage.service';

interface UseBookDiscountPercentageUpdateProps {
  book: BookDetail | null;
  bookId: string;
  refetch: () => Promise<void>;
}

export default function useBookDiscountPercentageUpdate({
  book,
  bookId,
  refetch,
}: UseBookDiscountPercentageUpdateProps) {
  const { addToast } = useToast();
  const [updatingDiscountPercentage, setUpdatingDiscountPercentage] =
    useState(false);
  const [discountPercentageInput, setDiscountPercentageInput] = useState('');

  useEffect(() => {
    if (book) {
      setDiscountPercentageInput(String(book.discountPercentage ?? 0));
    }
  }, [book]);

  const handleUpdateDiscountPercentage = async () => {
    if (!book || updatingDiscountPercentage) return;

    const nextDiscountPercentage = Number(discountPercentageInput.trim());

    if (
      !Number.isFinite(nextDiscountPercentage) ||
      nextDiscountPercentage < 0 ||
      nextDiscountPercentage > 100
    ) {
      addToast('Discount percentage must be between 0 and 100.', 'error');
      return;
    }

    try {
      setUpdatingDiscountPercentage(true);
      await updateBookDiscountPercentageService(bookId, {
        discountPercentage: nextDiscountPercentage,
      });
      await refetch();
      addToast('Book discount updated successfully.', 'success');
    } catch (error) {
      addToast(
        error instanceof Error
          ? error.message
          : 'Failed to update discount. Please try again.',
        'error',
      );
    } finally {
      setUpdatingDiscountPercentage(false);
    }
  };

  return {
    updatingDiscountPercentage,
    discountPercentageInput,
    setDiscountPercentageInput,
    handleUpdateDiscountPercentage,
  };
}
