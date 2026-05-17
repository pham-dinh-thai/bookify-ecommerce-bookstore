'use client';

import { use } from 'react';
import BookDetailScreen from './components/book-detail-screen';

export default function ViewBookDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <BookDetailScreen id={id} />;
}
