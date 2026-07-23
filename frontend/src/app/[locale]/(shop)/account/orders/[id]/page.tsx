'use client';

import { use } from 'react';
import MyOrderDetailScreen from '../components/my-order-detail-screen';

export default function MyOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <MyOrderDetailScreen id={id} />;
}
