import usePaginate from '@/app/admin/users/(features)/(user-management)/hooks/use-paginate';
import useSearch from '@/app/admin/users/(features)/(user-management)/hooks/use-search';

type UseAuthorsFilterProps = {
  authors: Author[];
  pageSize: number;
};

export default function useAuthorsFilter({
  authors,
  pageSize = 4,
}: UseAuthorsFilterProps) {
  const {
    search,
    setSearch,
    filtered: searched,
  } = useSearch<Author>({
    items: authors,
    fields: ['name'],
  });

  const { page, setPage, paginated, totalPages, resetPage } =
    usePaginate<Author>({
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
    filteredAuthors: searched,
    paginatedAuthors: paginated,
    totalPages,
  };
}
