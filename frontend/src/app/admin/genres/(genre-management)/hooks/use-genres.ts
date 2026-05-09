import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useEffect, useState } from 'react';
import { allGenreService } from '../services/all-genre.service';

export default function useGenres(page: number, limit: number, search: string) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [errors, setErrors] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      if (!getAccessToken()) {
        await refreshAccessToken();
      }

      const data = await allGenreService(page, limit, search);

      setGenres(data.genres);
      setTotal(data.total);
    } catch (err: any) {
      setErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, [page, limit, search]);

  return { genres, total, loading, errors, refetch: fetchGenres };
}
