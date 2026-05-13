import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useEffect, useState } from 'react';
import { Book } from '../../../types';
import { allBookService } from '../services/all-book.service';

export default function useBooks(page: number, limit: number, search: string) {
  const [books, setBooks] = useState<Book[]>([]);
  const [errors, setErrors] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      if (!getAccessToken()) {
        await refreshAccessToken();
      }

      const data = await allBookService(page, limit, search);

      setBooks(data.books);
      setTotal(data.total);
    } catch (err: any) {
      setErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, limit, search]);

  return { books, total, loading, errors, refetch: fetchBooks };
}
