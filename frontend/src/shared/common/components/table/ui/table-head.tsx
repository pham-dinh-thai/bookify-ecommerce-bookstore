type TableHeadProps = {
  columns: Column[];
  rowActions?: boolean | ((item: any) => React.ReactNode);
};

export default function TableHead({ columns, rowActions }: TableHeadProps) {
  return (
    <thead className="bg-[#f8faf7]">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6d7f72] ${
              column.align === 'center'
                ? 'text-center'
                : column.align === 'right'
                  ? 'text-right'
                  : 'text-left'
            } ${column.className || ''}`}
          >
            {column.label}
          </th>
        ))}
        {rowActions ? (
          <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6d7f72] text-right">
            Action
          </th>
        ) : null}
      </tr>
    </thead>
  );
}
