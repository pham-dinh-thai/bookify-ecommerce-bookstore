import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';

export type PaymentMethod =
  | 'cash_on_delivery'
  | 'bank_transfer'
  | 'card'
  | 'e_wallet';

export type PlaceOrderPayload = {
  paymentMethod: PaymentMethod;
  phoneNumber: string;
  shippingAddress: string;
  items: {
    productId: string;
    quantity: number;
  }[];
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

async function getRequiredAccessToken(): Promise<string> {
  const accessToken = getAccessToken() ?? (await refreshAccessToken());

  if (!accessToken) {
    throw new Error('Please sign in to place your order.');
  }

  return accessToken;
}

async function postOrder(
  payload: PlaceOrderPayload,
  accessToken: string,
): Promise<Response> {
  return fetch('/api/my-orders', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function placeOrderService(
  payload: PlaceOrderPayload,
): Promise<void> {
  const accessToken = await getRequiredAccessToken();
  let response = await postOrder(payload, accessToken);

  if (response.status === 401) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      response = await postOrder(payload, refreshedToken);
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}
