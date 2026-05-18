import { getAccessToken } from '@/shared/auth/lib/token-storage';

export const allCustomerService = async (
  page: number,
  limit: number,
  isActive?: boolean,
  search?: string,
) => {
  const token = getAccessToken();
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append('search', search);
  if (isActive !== undefined) params.append('isActive', String(isActive));

  const res = await fetch(`/api/customers?${params}`, {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  return await res.json();
};
