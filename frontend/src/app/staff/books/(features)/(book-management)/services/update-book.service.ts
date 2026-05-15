import { getAccessToken } from '@/shared/auth/lib/token-storage';

export interface IUpdateBookRequest {
  isbn: string;
  title: string;
  authorIds: string[];
  publisherId: string;
  genreIds: string[];
  description: string;
  languageId: string;
  pageCount: number;
}

export const updateBookService = async (
  id: string,
  data: IUpdateBookRequest,
) => {
  const token = getAccessToken();

  const res = await fetch(`/api/books/${id}`, {
    method: 'PUT',
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
