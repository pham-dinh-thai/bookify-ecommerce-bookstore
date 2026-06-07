import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';

export type PaymentMethod = 'cash_on_delivery' | 'e_wallet';

export type PlaceOrderPayload = {
  paymentMethod: PaymentMethod;
  phoneNumber: string;
  shippingAddress: string;
  items: {
    productId: string;
    quantity: number;
  }[];
};

export type PlaceOrderResponse = {
  orderId: string;
};

export type CreateMockPaymentResponse = {
  transactionId: string;
  providerOrderId: string;
  payUrl: string;
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
): Promise<PlaceOrderResponse> {
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

  return response.json() as Promise<PlaceOrderResponse>;
}

async function postMockPayment(
  orderId: string,
  accessToken: string,
): Promise<Response> {
  return fetch(`/api/payment/orders/${orderId}/mock`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function createMockPaymentService(
  orderId: string,
): Promise<CreateMockPaymentResponse> {
  const accessToken = await getRequiredAccessToken();
  let response = await postMockPayment(orderId, accessToken);

  if (response.status === 401) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      response = await postMockPayment(orderId, refreshedToken);
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json() as Promise<CreateMockPaymentResponse>;
}

async function postMockPaymentResult(
  transactionId: string,
  result: 'succeed' | 'fail',
  accessToken: string,
): Promise<Response> {
  return fetch(`/api/payment/mock/${transactionId}/${result}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function completeMockPaymentService(
  transactionId: string,
  result: 'succeed' | 'fail',
): Promise<void> {
  const accessToken = await getRequiredAccessToken();
  let response = await postMockPaymentResult(
    transactionId,
    result,
    accessToken,
  );

  if (response.status === 401) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      response = await postMockPaymentResult(
        transactionId,
        result,
        refreshedToken,
      );
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function scanSucceedMockPaymentService(
  transactionId: string,
): Promise<void> {
  const response = await fetch(
    `/api/payment/mock/${transactionId}/scan/succeed`,
    {
      method: 'GET',
      credentials: 'include',
    },
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}
