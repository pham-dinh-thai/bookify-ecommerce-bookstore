import usePaginate from '@/app/admin/users/(features)/(user-management)/hooks/use-paginate';
import useSearch from '@/app/admin/users/(features)/(user-management)/hooks/use-search';

type UseGenresFilterProps = {
  genres: Genre[];
  pageSize: number;
};

export default function useGenresFilter({
  genres,
  pageSize = 4,
}: UseGenresFilterProps) {
  const {
    search,
    setSearch,
    filtered: searched,
  } = useSearch<Genre>({
    items: genres,
    fields: ['name'],
  });

  const { page, setPage, paginated, totalPages, resetPage } =
    usePaginate<Genre>({
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
    filteredGenres: searched,
    paginatedGenres: paginated,
    totalPages,
  };
}
