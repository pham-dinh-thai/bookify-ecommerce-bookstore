'use client';

import { useState } from 'react';
import Paginate from '@/shared/common/components/pagination/paginate';

type CollectionPagePaginationProps = {
  initialPage?: number;
  pageSize: number;
  total: number;
  showTotal?: boolean;
};

export default function CollectionPagePagination({
  initialPage = 1,
  pageSize,
  total,
  showTotal = true,
}: CollectionPagePaginationProps) {
  const [page, setPage] = useState(initialPage);

  return (
    <Paginate
      page={page}
      pageSize={pageSize}
      total={total}
      onPageChange={setPage}
      showTotal={showTotal}
    />
  );
}
