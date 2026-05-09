import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useEffect, useState } from 'react';
import { allLanguageService } from '../services/all-language.service';

export default function useLanguages(
  page: number,
  limit: number,
  search: string,
) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [errors, setErrors] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchLanguages = async () => {
    setLoading(true);
    try {
      if (!getAccessToken()) {
        await refreshAccessToken();
      }

      const data = await allLanguageService(page, limit, search);

      setLanguages(data.languages);
      setTotal(data.total);
    } catch (err: any) {
      setErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, [page, limit, search]);

  return { languages, total, loading, errors, refetch: fetchLanguages };
}
