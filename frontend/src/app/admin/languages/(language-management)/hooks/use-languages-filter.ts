import usePaginate from '@/app/admin/users/(features)/(user-management)/hooks/use-paginate';
import useSearch from '@/app/admin/users/(features)/(user-management)/hooks/use-search';

interface Language {
  id: string;
  name: string;
}

type UseLanguageFilterProps = {
  languages: Language[];
  pageSize: number;
};

export default function useLanguagesFilter({
  languages,
  pageSize = 4,
}: UseLanguageFilterProps) {
  const {
    search,
    setSearch,
    filtered: searched,
  } = useSearch<Language>({
    items: languages,
    fields: ['id', 'name'],
  });

  const { page, setPage, paginated, totalPages, resetPage } =
    usePaginate<Language>({
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
    filteredLanguages: searched,
    paginatedLanguages: paginated,
    totalPages,
  };
}
