import { useState } from 'react';
import { useToast } from '@/shared/common/toast/toast';
import { adjustBookStockService } from '../../services/adjust-book-stock.service';

interface UseBookStockAdjustProps {
  bookId: string;
  refetch: () => Promise<void>;
}

export default function useBookStockAdjust({
  bookId,
  refetch,
}: UseBookStockAdjustProps) {
  const { addToast } = useToast();
  const [adjustingStock, setAdjustingStock] = useState(false);

  const handleAdjustStock = async (nextQuantity: number) => {
    if (adjustingStock) return;

    try {
      setAdjustingStock(true);
      await adjustBookStockService(bookId, { quantity: nextQuantity });
      await refetch();
      addToast('Book stock updated successfully.', 'success');
    } catch (error) {
      addToast(
        error instanceof Error
          ? error.message
          : 'Failed to update stock. Please try again.',
        'error',
      );
    } finally {
      setAdjustingStock(false);
    }
  };

  return {
    adjustingStock,
    handleAdjustStock,
  };
}
