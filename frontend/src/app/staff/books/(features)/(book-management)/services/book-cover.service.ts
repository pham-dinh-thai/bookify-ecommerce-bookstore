import { getAccessToken } from '@/shared/auth/lib/token-storage';

export interface IAddBookCoverRequest {
  url: string;
  displayOrder: number;
}

export const uploadBookCoverFileService = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/files/upload', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const text = await res.text();
  let parsed: { url?: string; message?: string; code?: string } | null = null;

  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok || !parsed?.url) {
    throw new Error(parsed?.message || text || 'Upload image failed');
  }

  return parsed.url;
};

export const createBookCoverService = async (
  bookId: string,
  payload: IAddBookCoverRequest,
) => {
  const token = getAccessToken();

  const res = await fetch(`/api/books/${bookId}/covers`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let parsed: { message?: string } | null = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    throw new Error(parsed?.message || text || 'Failed to add cover');
  }

  return parsed;
};

export const deleteBookCoverService = async (
  bookId: string,
  coverId: string,
) => {
  const token = getAccessToken();

  const res = await fetch(`/api/books/${bookId}/covers/${coverId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  let parsed: { message?: string } | null = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    throw new Error(parsed?.message || text || 'Failed to delete cover');
  }

  return parsed;
};
