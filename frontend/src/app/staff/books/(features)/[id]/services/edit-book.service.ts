import { getAccessToken } from '@/shared/auth/lib/token-storage';

export type BookCoverItem = {
  id: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
};

export type BookDetailResponse = {
  id: string;
  isbn: string;
  title: string;
  description: string;
  originalPrice: number;
  quantity: number;
  pageCount: number;
  languageId?: string;
  publisherId?: string;
  authorIds?: string[];
  genreIds?: string[];
  covers?: BookCoverItem[];
};

export type UpdateBookPayload = {
  isbn: string;
  title: string;
  authorIds: string[];
  publisherId: string;
  genreIds: string[];
  description: string;
  languageId: string;
  pageCount: number;
};

const withAuth = () => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res: Response) => {
  const text = await res.text();
  let parsed: { message?: string } | null = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    throw new Error(parsed?.message || text || 'Request failed');
  }

  return parsed;
};

export const findOneBookService = async (id: string): Promise<BookDetailResponse | null> => {
  const res = await fetch(`/api/books/${id}`, { credentials: 'include' });
  const text = await res.text();
  return text ? (JSON.parse(text) as BookDetailResponse) : null;
};

export const updateBookService = async (id: string, payload: UpdateBookPayload) => {
  const res = await fetch(`/api/books/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: withAuth(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const updateBookPriceService = async (id: string, price: number) => {
  const res = await fetch(`/api/books/${id}/price`, {
    method: 'PATCH',
    credentials: 'include',
    headers: withAuth(),
    body: JSON.stringify({ price }),
  });
  return handleResponse(res);
};

export const adjustBookStockService = async (id: string, quantity: number) => {
  const res = await fetch(`/api/books/${id}/stock/adjust`, {
    method: 'PATCH',
    credentials: 'include',
    headers: withAuth(),
    body: JSON.stringify({ quantity }),
  });
  return handleResponse(res);
};

export const addBookCoverService = async (
  id: string,
  url: string,
  displayOrder: number,
) => {
  const res = await fetch(`/api/books/${id}/book-cover`, {
    method: 'POST',
    credentials: 'include',
    headers: withAuth(),
    body: JSON.stringify({ url, displayOrder }),
  });
  return handleResponse(res);
};

export const removeBookCoverService = async (bookId: string, coverId: string) => {
  const res = await fetch(`/api/books/${bookId}/book-cover/${coverId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: withAuth(),
  });
  return handleResponse(res);
};
