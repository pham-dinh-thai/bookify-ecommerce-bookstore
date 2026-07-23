import { getAccessToken, isExplicitLogin } from '@/shared/auth/lib/token-storage';
import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import type { StoredCartItem } from './cart-storage';

const CART_ENDPOINT = '/api/carts';

type AddCartItemPayload = {
  productId: string;
  quantity: number;
  price: number;
};

type CartItemApiResponse = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  isActive: boolean;
  title: string;
  author: string;
  edition: string;
  cover: string;
  stock: number;
  isAvailable: boolean;
};

type CartApiResponse = {
  id: string;
  userId: string;
  items: CartItemApiResponse[];
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

function toStoredCartItem(apiItem: CartItemApiResponse): StoredCartItem {
  return {
    id: apiItem.productId,
    title: apiItem.title,
    author: apiItem.author,
    edition: apiItem.edition,
    price: apiItem.price,
    quantity: apiItem.quantity,
    stock: apiItem.stock,
    cover: apiItem.cover,
    isAvailable: apiItem.isAvailable,
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

async function getCart(accessToken: string): Promise<Response> {
  return fetch(CART_ENDPOINT, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

async function patchCartItemQuantity(
  productId: string,
  quantity: number,
  accessToken: string,
): Promise<Response> {
  return fetch(`${CART_ENDPOINT}/${encodeURIComponent(productId)}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ quantity }),
  });
}

export async function addCartItemService(item: StoredCartItem): Promise<void> {
  if (!getAccessToken() || !isExplicitLogin()) return;

  const payload = toAddCartItemPayload(item);

  let response = await postCartItem(payload, getAccessToken()!);

  if (response.status === 401) {
    const refreshedAccessToken = await refreshAccessToken();
    if (refreshedAccessToken) {
      response = await postCartItem(payload, refreshedAccessToken);
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function removeCartItemService(productId: string): Promise<void> {
  if (!getAccessToken() || !isExplicitLogin()) return;

  let response = await deleteCartItem(productId, getAccessToken()!);

  if (response.status === 401) {
    const refreshedAccessToken = await refreshAccessToken();
    if (refreshedAccessToken) {
      response = await deleteCartItem(productId, refreshedAccessToken);
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function fetchCartService(): Promise<StoredCartItem[]> {
  if (!getAccessToken() || !isExplicitLogin()) return [];

  let response = await getCart(getAccessToken()!);

  if (response.status === 401) {
    const refreshedAccessToken = await refreshAccessToken();
    if (refreshedAccessToken) {
      response = await getCart(refreshedAccessToken);
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const cart = (await response.json()) as CartApiResponse | null;
  if (!cart?.items) return [];

  return cart.items.filter((item) => item.isActive).map(toStoredCartItem);
}

export async function updateCartItemQuantityService(
  productId: string,
  quantity: number,
): Promise<void> {
  if (!getAccessToken() || !isExplicitLogin()) return;

  let response = await patchCartItemQuantity(
    productId,
    quantity,
    getAccessToken()!,
  );

  if (response.status === 401) {
    const refreshedAccessToken = await refreshAccessToken();
    if (refreshedAccessToken) {
      response = await patchCartItemQuantity(
        productId,
        quantity,
        refreshedAccessToken,
      );
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}
