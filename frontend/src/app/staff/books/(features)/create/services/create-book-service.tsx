import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { CreateBookForm } from '../../../types';

export const uploadBookCoverService = async (file: File) => {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/files/upload', {
    method: 'POST',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const text = await res.text();

  let parsed: { url?: string; message?: string; code?: string } | null = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok || !parsed?.url) {
    throw {
      message: parsed?.message || text || 'Upload image failed',
      code: parsed?.code,
    };
  }

  return parsed.url;
};

export const createBookService = async (data: CreateBookForm) => {
  const token = getAccessToken();

  const res = await fetch('/api/books', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  console.log('RESPONSE:', text);

  let parsed: { message?: string; code?: string } | null = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    throw {
      message: parsed?.message || text || 'Something went wrong',
      code: parsed?.code,
    };
  }

  return parsed;
};
