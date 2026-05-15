import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useEffect, useState } from 'react';
import { findBookService } from '../services/find-book.service';
import { BookDetail } from '../../../types';

export default function useBookDetail(id: string) {
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Error | null>(null);

  const fetchBook = async () => {
    setLoading(true);
    try {
      if (!getAccessToken()) {
        await refreshAccessToken();
      }
      const data = await findBookService(id);
      setBook(data);
    } catch (err: any) {
      setErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchBook();
  }, [id]);

  return { book, loading, errors, refetch: fetchBook };
}
