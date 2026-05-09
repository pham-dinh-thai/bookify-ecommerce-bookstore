import usePaginate from '@/app/admin/users/(features)/(user-management)/hooks/use-paginate';
import useSearch from '@/app/admin/users/(features)/(user-management)/hooks/use-search';

type UsePublisherFilterProps = {
  publishers: Publisher[];
  pageSize: number;
};

export default function usePublishersFilter({
  publishers,
  pageSize = 4,
}: UsePublisherFilterProps) {
  const {
    search,
    setSearch,
    filtered: searched,
  } = useSearch<Publisher>({
    items: publishers,
    fields: ['name'],
  });

  const { page, setPage, paginated, totalPages, resetPage } =
    usePaginate<Publisher>({
      items: searched,
      pageSize,
    });

  const handleSearch = (value: string) => {
    setSearch(value);
    resetPage();
  };

  return {
    search,
    setSearch: handleSearch,
    page,
    setPage,
    filteredPublishers: searched,
    paginatedPublishers: paginated,
    totalPages,
  };
}
