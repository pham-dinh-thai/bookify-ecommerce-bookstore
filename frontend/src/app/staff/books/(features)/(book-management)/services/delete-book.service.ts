import { getAccessToken } from '@/shared/auth/lib/token-storage';

export const deleteBookService = async (id: string) => {
  const token = getAccessToken();

  const res = await fetch(`/api/books/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    let parsed: { message?: string } | null = null;

    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {}

    throw new Error(parsed?.message || text || 'Failed to delete book');
  }
};
