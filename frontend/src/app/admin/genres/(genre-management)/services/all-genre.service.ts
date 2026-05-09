import { getAccessToken } from '@/shared/auth/lib/token-storage';

export const allGenreService = async (
  page: number,
  limit: number,
  search: string,
) => {
  const token = getAccessToken();

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search ? { search } : {}),
  });

  const res = await fetch(`/api/genres?${params.toString()}`, {
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
