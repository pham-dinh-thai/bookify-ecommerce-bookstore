import { useEffect, useState } from 'react';
import { allUserService } from '../services/all-user.service';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { refreshAccessToken } from '@/shared/auth/lib/refresh';

export default function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        if (!getAccessToken()) {
          await refreshAccessToken();
        }

        const data = await allUserService();
        const normalized = data.map((user: User) => ({
          ...user,
          name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
          gender: user.gender ?? 'N/A',
          role: user.roleId ?? 'N/A',
          status: user.isActive ? 'Active' : 'Inactive',
        }));

        setUsers(normalized);
        console.log(normalized);
      } catch (err: any) {
        setErrors(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, errors };
}
