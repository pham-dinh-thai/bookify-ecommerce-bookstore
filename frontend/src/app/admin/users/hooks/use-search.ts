import { useMemo, useState } from 'react';

type UseSearchProps<T> = {
  items: T[];
  fields: (keyof T)[];
};

export default function useSearch<T extends Record<string, any>>({
  items,
  fields,
}: UseSearchProps<T>) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      items.filter((item) =>
        fields.some((field) =>
          String(item[field] ?? '')
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
      ),
    [search, items, fields],
  );

  return { search, setSearch, filtered };
}
