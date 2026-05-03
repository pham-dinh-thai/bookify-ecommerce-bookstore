import { useEffect, useState } from 'react';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { findOneUserService } from '../services/find-one-user.service';

export default function useEditUser(id: string) {
  const [user, setUser] = useState<User>();
  const [errors, setErrors] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        if (!getAccessToken()) {
          await refreshAccessToken();
        }

        const data = await findOneUserService(id);
        const normalized = {
          ...data,
        };

        setUser(normalized);
      } catch (err: any) {
        setErrors(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { user, loading, errors };
}
