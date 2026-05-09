import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useEffect, useState } from 'react';
import { allAuthorService } from '../services/all-author.service';

export default function useAuthors(
  page: number,
  limit: number,
  search: string,
) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [errors, setErrors] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      if (!getAccessToken()) await refreshAccessToken();
      const data = await allAuthorService(page, limit, search);

      setAuthors(data.authors);
      setTotal(data.total);
    } catch (err: any) {
      setErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [page, limit, search]);

  return { authors, total, loading, errors, refetch: fetchAuthors };
}
