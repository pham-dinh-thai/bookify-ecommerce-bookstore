import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { OrderStatus } from '../types';

export const updateOrderStatusService = async (
  orderId: string,
  status: OrderStatus,
) => {
  const token = getAccessToken();

  const res = await fetch(`/api/orders/${orderId}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    let message = `HTTP error: ${res.status}`;

    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {
      // Keep the original HTTP status message when the response is not JSON.
    }

    throw new Error(message);
  }
};
