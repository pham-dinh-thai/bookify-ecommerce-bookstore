import { getAccessToken } from '@/shared/auth/lib/token-storage';

export interface IUpdateBookPriceRequest {
  originalPrice: number;
}

export const updateBookPriceService = async (
  id: string,
  data: IUpdateBookPriceRequest,
) => {
  const token = getAccessToken();

  const res = await fetch(`/api/books/${id}/price`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  let parsed: { message?: string; code?: string } | null = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    throw new Error(parsed?.message || text || 'Failed to update book price');
  }

  return parsed;
};
