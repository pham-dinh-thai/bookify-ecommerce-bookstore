import { getAccessToken } from '@/shared/auth/lib/token-storage';

type UpdateBookPayload = {
  isbn: string;
  publisher: string;
  pageCount: number;
  language: string;
  genres: string[];
  authors: string[];
  description: string;
};

export const updateBookService = async (id: string, data: UpdateBookPayload) => {
  const token = getAccessToken();

  const res = await fetch(`/api/books/${id}`, {
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
    throw new Error(parsed?.message || text || 'Failed to update book');
  }

  return parsed;
};
