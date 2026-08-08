import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { BookReviews, MyReview } from '../types';

function reviewsEndpoint(bookId: string): string {
  return `/api/books/${encodeURIComponent(bookId)}/reviews`;
}

async function getErrorMessage(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) return `HTTP error: ${response.status}`;

  try {
    const data = JSON.parse(text) as { message?: string | string[] };
    if (Array.isArray(data.message)) return data.message[0] ?? text;
    return data.message ?? text;
  } catch {
    return text;
  }
}

function jsonHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function findBookReviewsService(
  bookId: string,
): Promise<BookReviews> {
  const response = await fetch(reviewsEndpoint(bookId), {
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as BookReviews;
}

export async function findMyReviewService(
  bookId: string,
): Promise<MyReview | null> {
  if (!getAccessToken()) return null;

  let response = await fetch(`${reviewsEndpoint(bookId)}/mine`, {
    credentials: 'include',
    headers: jsonHeaders(getAccessToken()!),
  });

  if (response.status === 401) {
    const refreshedAccessToken = await refreshAccessToken();
    if (refreshedAccessToken) {
      response = await fetch(`${reviewsEndpoint(bookId)}/mine`, {
        credentials: 'include',
        headers: jsonHeaders(refreshedAccessToken),
      });
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as MyReview;
}

export async function addReviewService(
  bookId: string,
  input: { rating: number; comment?: string | null },
): Promise<void> {
  if (!getAccessToken()) return;

  let response = await fetch(reviewsEndpoint(bookId), {
    method: 'POST',
    credentials: 'include',
    headers: jsonHeaders(getAccessToken()!),
    body: JSON.stringify(input),
  });

  if (response.status === 401) {
    const refreshedAccessToken = await refreshAccessToken();
    if (refreshedAccessToken) {
      response = await fetch(reviewsEndpoint(bookId), {
        method: 'POST',
        credentials: 'include',
        headers: jsonHeaders(refreshedAccessToken),
        body: JSON.stringify(input),
      });
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function updateReviewService(
  bookId: string,
  reviewId: string,
  input: { rating: number; comment?: string | null },
): Promise<void> {
  if (!getAccessToken()) return;

  const url = `${reviewsEndpoint(bookId)}/${encodeURIComponent(reviewId)}`;

  let response = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: jsonHeaders(getAccessToken()!),
    body: JSON.stringify(input),
  });

  if (response.status === 401) {
    const refreshedAccessToken = await refreshAccessToken();
    if (refreshedAccessToken) {
      response = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        headers: jsonHeaders(refreshedAccessToken),
        body: JSON.stringify(input),
      });
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function deleteReviewService(
  bookId: string,
  reviewId: string,
): Promise<void> {
  if (!getAccessToken()) return;

  const url = `${reviewsEndpoint(bookId)}/${encodeURIComponent(reviewId)}`;

  let response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: jsonHeaders(getAccessToken()!),
  });

  if (response.status === 401) {
    const refreshedAccessToken = await refreshAccessToken();
    if (refreshedAccessToken) {
      response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        headers: jsonHeaders(refreshedAccessToken),
      });
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}
