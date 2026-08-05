import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { WishlistItem } from '../types';

const WISHLIST_ENDPOINT = '/api/wishlists';

type WishlistApiResponse = {
  id: string;
  userId: string;
  items: WishlistItem[];
};

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

async function getWishlist(accessToken: string): Promise<Response> {
  return fetch(WISHLIST_ENDPOINT, {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

async function postWishlistItem(
  itemId: string,
  accessToken: string,
): Promise<Response> {
  return fetch(WISHLIST_ENDPOINT, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ itemId }),
  });
}

async function deleteWishlistItem(
  itemId: string,
  accessToken: string,
): Promise<Response> {
  return fetch(`${WISHLIST_ENDPOINT}/item/${encodeURIComponent(itemId)}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function findWishlistService(): Promise<WishlistItem[]> {
  if (!getAccessToken()) return [];

  let response = await getWishlist(getAccessToken()!);

  if (response.status === 401) {
    const refreshedAccessToken = await refreshAccessToken();
    if (refreshedAccessToken) {
      response = await getWishlist(refreshedAccessToken);
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const wishlist = (await response.json()) as WishlistApiResponse | null;

  return wishlist?.items ?? [];
}

export async function addWishlistItemService(itemId: string): Promise<void> {
  if (!getAccessToken()) return;

  let response = await postWishlistItem(itemId, getAccessToken()!);

  if (response.status === 401) {
    const refreshedAccessToken = await refreshAccessToken();
    if (refreshedAccessToken) {
      response = await postWishlistItem(itemId, refreshedAccessToken);
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function removeWishlistItemService(itemId: string): Promise<void> {
  if (!getAccessToken()) return;

  let response = await deleteWishlistItem(itemId, getAccessToken()!);

  if (response.status === 401) {
    const refreshedAccessToken = await refreshAccessToken();
    if (refreshedAccessToken) {
      response = await deleteWishlistItem(itemId, refreshedAccessToken);
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}
