'use client';

import { useState } from 'react';
import BookManagementHeader from './ui/book-management-header';
import useBooks from './hooks/use-books';

export default function BookManagementPage() {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { books, total, loading, errors, refetch } = useBooks(
    page,
    pageSize,
    search,
  );

  console.log(books);

  return (
    <div>
      <div className="p-12">
        <BookManagementHeader />
      </div>
    </div>
  );
}
