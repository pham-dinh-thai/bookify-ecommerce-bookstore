import { getAccessToken } from '@/shared/auth/lib/token-storage';

export const importBookStockService = async (
  bookId: string,
  quantity: number,
): Promise<void> => {
  const token = getAccessToken();

  const res = await fetch(`/api/books/${bookId}/stock/import`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) {
    let message = 'Failed to import stock';
    try {
      const parsed = await res.json();
      message = parsed?.message || message;
    } catch {
      const text = await res.text().catch(() => '');
      if (text) message = text;
    }
    throw new Error(message);
  }
};
