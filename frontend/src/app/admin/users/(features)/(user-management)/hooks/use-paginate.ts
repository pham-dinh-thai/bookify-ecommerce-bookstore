import { useMemo, useState } from 'react';

type UsePaginateProps<T> = {
  items: T[];
  pageSize: number;
};

export default function usePaginate<T extends Record<string, any>>({
  items,
  pageSize = 10,
}: UsePaginateProps<T>) {
  const [page, setPage] = useState(1);

  const paginated = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, page, pageSize]);

  const totalPages = Math.ceil(items.length / pageSize);

  const resetPage = () => setPage(1);

  return {
    page,
    setPage,
    paginated,
    totalPages,
    resetPage,
  };
}
