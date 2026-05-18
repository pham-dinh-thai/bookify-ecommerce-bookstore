import { useCallback, useMemo, useState } from 'react';
import { useToast } from '@/shared/common/toast/toast';
import { allBookService } from '../../books/(features)/(book-management)/services/all-book.service';
import { importBookStockService } from '../services/import-book-stock.service';
import { Book } from '../../books/types';
import { findBookService } from '../../books/(features)/(book-management)/services/find-book.service';
import { BookDetail } from '../../books/types';

export default function useImportStock() {
  const { addToast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedBookDetail, setSelectedBookDetail] = useState<BookDetail | null>(
    null,
  );
  const [loadingBookDetail, setLoadingBookDetail] = useState(false);

  const fetchBookDetail = useCallback(
    async (bookId: string) => {
      if (!bookId) {
        setSelectedBookDetail(null);
        return;
      }

      try {
        setLoadingBookDetail(true);
        const detail = await findBookService(bookId);
        setSelectedBookDetail(detail ?? null);
      } catch (error: unknown) {
        setSelectedBookDetail(null);
        const message =
          error instanceof Error ? error.message : 'Failed to load book detail';
        addToast(message, 'error');
      } finally {
        setLoadingBookDetail(false);
      }
    },
    [addToast],
  );

  const loadBooks = useCallback(async () => {
    setLoadingBooks(true);
    try {
      const result = await allBookService(1, 200, '');
      const normalizedBooks = (result?.books || []).map((book: Book) => ({
        ...book,
        status: book.isInStock ? 'In Stock' : 'Out of Stock',
      }));
      setBooks(normalizedBooks);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to load books';
      addToast(message, 'error');
    } finally {
      setLoadingBooks(false);
    }
  }, [addToast]);

  const selectedBook = useMemo(
    () => books.find((book) => book.id === selectedBookId),
    [books, selectedBookId],
  );

  const canImport = Boolean(selectedBookId) && Number(quantity) > 0 && !importing;

  const selectBook = useCallback(async (bookId: string) => {
    setSelectedBookId(bookId);
    await fetchBookDetail(bookId);
  }, [fetchBookDetail]);

  const importStock = async () => {
    const parsedQuantity = Number(quantity);

    if (!selectedBookId) {
      addToast('Please select a book.', 'error');
      return;
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      addToast('Quantity must be a positive integer.', 'error');
      return;
    }

    try {
      setImporting(true);
      await importBookStockService(selectedBookId, parsedQuantity);
      await fetchBookDetail(selectedBookId);
      addToast('Import stock successfully.', 'success');
      setQuantity('');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to import stock';
      addToast(message, 'error');
    } finally {
      setImporting(false);
    }
  };

  return {
    books,
    selectedBookId,
    setSelectedBookId: selectBook,
    quantity,
    setQuantity,
    selectedBook,
    selectedBookDetail,
    loadingBookDetail,
    loadingBooks,
    importing,
    canImport,
    loadBooks,
    importStock,
  };
}
