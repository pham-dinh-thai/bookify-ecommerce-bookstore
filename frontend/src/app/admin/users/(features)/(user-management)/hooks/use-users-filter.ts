import { useMemo, useState } from 'react';
import usePaginate from './use-paginate';
import useSearch from './use-search';

type useUsersFilterProps = {
  users: User[];
  pageSize: number;
};

type FilterOptions = {
  role: string;
  status: string;
};

export default function useUsersFilter({
  users,
  pageSize = 4,
}: useUsersFilterProps) {
  const [filter, setFilter] = useState<FilterOptions>({ role: '', status: '' });

  const {
    search,
    setSearch,
    filtered: searched,
  } = useSearch<User>({
    items: users,
    fields: ['firstName', 'lastName', 'email'],
  });

  const filtered = useMemo(() => {
    return searched
      .filter((item) => !filter.role || item.roleId === filter.role)
      .filter(
        (item) =>
          !filter.status ||
          (filter.status === 'Active' ? item.isActive : !item.isActive),
      );
  }, [searched, filter]);

  const { page, setPage, paginated, totalPages, resetPage } = usePaginate<User>(
    {
      items: filtered,
      pageSize,
    },
  );

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
