import { getAccessToken } from '@/shared/auth/lib/token-storage';

export const allUserService = async (
  page: number,
  limit: number,
  roleId?: string,
  excludeRoleId?: string,
  isActive?: boolean,
  search?: string,
) => {
  const token = getAccessToken();

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append('search', search);
  if (roleId) params.append('roleId', roleId);
  if (excludeRoleId) params.append('excludeRoleId', excludeRoleId);
  if (isActive !== undefined) params.append('isActive', String(isActive));

  const res = await fetch(`/api/users?${params}`, {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  return res.json();
};
