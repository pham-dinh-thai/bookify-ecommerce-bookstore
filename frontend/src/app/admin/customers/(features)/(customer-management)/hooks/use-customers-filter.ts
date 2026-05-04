import usePaginate from '@/app/admin/users/(features)/(user-management)/hooks/use-paginate';
import useSearch from '@/app/admin/users/(features)/(user-management)/hooks/use-search';
import { useMemo, useState } from 'react';

type useCustomersFilterProps = {
  customers: Customer[];
  pageSize: number;
};

type FilterOptions = {
  status: string;
};

export default function useCustomersFilter({
  customers,
  pageSize = 4,
}: useCustomersFilterProps) {
  const [filter, setFilter] = useState<FilterOptions>({ status: '' });

  const {
    search,
    setSearch,
    filtered: searched,
  } = useSearch<Customer>({
    items: customers,
    fields: ['firstName', 'lastName', 'email'],
  });

  const filtered = useMemo(() => {
    return searched.filter(
      (item) => !filter.status || item.status === filter.status,
    );
  }, [searched, filter]);

  const { page, setPage, paginated, totalPages, resetPage } =
    usePaginate<Customer>({
      items: filtered,
      pageSize,
    });

  const handleSearch = (value: string) => {
    setSearch(value);
    resetPage();
  };

  const handleFilter = (newFilter: FilterOptions) => {
    setFilter(newFilter);
    resetPage();
  };

  return {
    search,
    setSearch: handleSearch,
    filter,
    setFilter: handleFilter,
    page,
    setPage,
    filteredUsers: filtered,
    paginatedUsers: paginated,
    totalPages,
  };
}
