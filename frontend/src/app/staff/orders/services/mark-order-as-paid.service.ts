import { getAccessToken } from '@/shared/auth/lib/token-storage';

export const markOrderAsPaidService = async (orderId: string) => {
  const token = getAccessToken();

  const res = await fetch(`/api/orders/${orderId}/payment-status/paid`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
