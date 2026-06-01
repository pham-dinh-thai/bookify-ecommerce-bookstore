'use client';

import { use } from 'react';
import OrderDetailScreen from '../components/order-detail-screen';

export default function ViewOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <OrderDetailScreen id={id} />;
}
