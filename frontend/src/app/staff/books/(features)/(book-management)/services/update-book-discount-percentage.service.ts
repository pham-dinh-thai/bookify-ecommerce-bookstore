import { getAccessToken } from '@/shared/auth/lib/token-storage';

export interface IUpdateBookDiscountPercentageRequest {
  discountPercentage: number;
}

export const updateBookDiscountPercentageService = async (
  id: string,
  data: IUpdateBookDiscountPercentageRequest,
) => {
  const token = getAccessToken();

  const res = await fetch(`/api/books/${id}/discount-percentage`, {
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
    throw new Error(
      parsed?.message || text || 'Failed to update book discount percentage',
    );
  }

  return parsed;
};
