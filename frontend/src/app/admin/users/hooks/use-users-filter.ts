import usePaginate from './use-paginate';
import useSearch from './use-search';

type useUsersFilterProps = {
  users: User[];
  pageSize: number;
};

export default function useUsersFilter({
  users,
  pageSize = 4,
}: useUsersFilterProps) {
  const { search, setSearch, filtered } = useSearch<User>({
    items: users,
    fields: ['firstName', 'lastName', 'email'],
  });

  const { page, setPage, paginated, totalPages, resetPage } = usePaginate<User>(
    {
      items: filtered,
      pageSize,
    },
  );

  const handleSearch = (value: any) => {
    setSearch(value);
    resetPage();
  };

  return {
    search,
    setSearch: handleSearch,
    page,
    setPage,
    filteredUsers: filtered,
    paginatedUsers: paginated,
    totalPages,
  };
}
