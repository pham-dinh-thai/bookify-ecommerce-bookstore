import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { MyOrder, MyOrderDetail } from '../types';

const MY_ORDERS_ENDPOINT = '/api/my-orders';

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

function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function ensureAccessToken(): Promise<string> {
  const accessToken = getAccessToken() ?? (await refreshAccessToken());

  if (!accessToken) {
    throw new Error('Please sign in to continue.');
  }

  return accessToken;
}

export async function findMyOrdersService(): Promise<MyOrder[]> {
  const response = await fetch(MY_ORDERS_ENDPOINT, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const data = (await response.json()) as { orders?: MyOrder[] };

  return Array.isArray(data.orders) ? data.orders : [];
}

export async function findMyOrderDetailService(
  orderId: string,
): Promise<MyOrderDetail> {
  const response = await fetch(`${MY_ORDERS_ENDPOINT}/${orderId}`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as MyOrderDetail;
}

export async function cancelMyOrderService(orderId: string): Promise<void> {
  const response = await fetch(`${MY_ORDERS_ENDPOINT}/${orderId}/cancel`, {
    method: 'PATCH',
    credentials: 'include',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export type RetryPaymentResponse = {
  transactionId: string;
  providerOrderId: string;
  payUrl: string;
};

async function postRetryPayment(
  orderId: string,
  accessToken: string,
): Promise<Response> {
  return fetch(`/api/payment/orders/${orderId}/vnpay/retry`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function retryVnpayPaymentService(
  orderId: string,
): Promise<RetryPaymentResponse> {
  const accessToken = await ensureAccessToken();
  let response = await postRetryPayment(orderId, accessToken);

  if (response.status === 401) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      response = await postRetryPayment(orderId, refreshedToken);
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json() as Promise<RetryPaymentResponse>;
}
