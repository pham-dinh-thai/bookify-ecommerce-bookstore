import { useEffect, useState } from 'react';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { allUserService } from '../services/all-user.service';

export default function useUsers(
  page: number,
  limit: number,
  roleId?: string,
  excludeRoleId?: string,
  isActive?: boolean,
  search?: string,
) {
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (!getAccessToken()) {
        await refreshAccessToken();
      }

      const data = await allUserService(
        page,
        limit,
        roleId,
        excludeRoleId,
        isActive,
        search,
      );

      const normalized = data.users.map((user: User) => ({
        ...user,
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        gender: !user.gender
          ? 'N/A'
          : user.gender.charAt(0).toUpperCase() +
            user.gender.slice(1).toLowerCase(),
        role: !user.roleId
          ? 'N/A'
          : user.roleId.charAt(0).toUpperCase() +
            user.roleId.slice(1).toLowerCase(),
        status: user.isActive ? 'Active' : 'Inactive',
      }));

      setUsers(normalized);
      setTotal(data.total);
    } catch (err: any) {
      setErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, roleId, excludeRoleId, isActive, search]);

  return { users, total, loading, errors, refetch: fetchUsers };
}
