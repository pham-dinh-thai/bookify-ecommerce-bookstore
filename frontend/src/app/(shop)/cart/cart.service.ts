import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import type { StoredCartItem } from './cart-storage';

const CART_ENDPOINT = '/api/carts';

type AddCartItemPayload = {
  productId: string;
  quantity: number;
  price: number;
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

function toAddCartItemPayload(item: StoredCartItem): AddCartItemPayload {
  return {
    productId: item.id,
    quantity: item.quantity,
    price: item.price,
  };
}

async function postCartItem(
  payload: AddCartItemPayload,
  accessToken: string,
): Promise<Response> {
  return fetch(CART_ENDPOINT, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}

async function deleteCartItem(
  productId: string,
  accessToken: string,
): Promise<Response> {
  return fetch(`${CART_ENDPOINT}/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

async function getRequiredAccessToken(): Promise<string> {
  const accessToken = getAccessToken() ?? (await refreshAccessToken());

  if (!accessToken) {
    throw new Error('Please sign in to manage your cart.');
  }

  return accessToken;
}

export async function addCartItemService(item: StoredCartItem): Promise<void> {
  const payload = toAddCartItemPayload(item);
  let accessToken = await getRequiredAccessToken();

  let response = await postCartItem(payload, accessToken);

  if (response.status === 401) {
    accessToken = await refreshAccessToken();
    if (accessToken) {
      response = await postCartItem(payload, accessToken);
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function removeCartItemService(productId: string): Promise<void> {
  let accessToken = await getRequiredAccessToken();
  let response = await deleteCartItem(productId, accessToken);

  if (response.status === 401) {
    accessToken = await refreshAccessToken();
    if (accessToken) {
      response = await deleteCartItem(productId, accessToken);
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}
