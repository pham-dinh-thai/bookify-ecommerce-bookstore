import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { OrderDetail } from '../types';

export const findOrderService = async (
  orderId: string,
): Promise<OrderDetail> => {
  const token = getAccessToken();

  const res = await fetch(`/api/orders/${orderId}`, {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  return await res.json();
};
