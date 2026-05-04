type TableBodyProps<T> = {
  data: T[];
  columns: (Column & { render?: (item: T) => React.ReactNode })[];
  rowActions?: (item: T) => React.ReactNode;
  emptyText?: string;
  getId: (item: T, index: number) => string | number;
  onRowClick?: (item: T) => void;
};

export default function TableBody<T extends Record<string, any>>({
  data,
  columns,
  rowActions,
  emptyText = 'No data',
  getId,
  onRowClick,
}: TableBodyProps<T>) {
  return (
    <tbody className="divide-y divide-[#eef2ea]">
      {data.length === 0 ? (
        <tr>
          <td
            colSpan={columns.length + (rowActions ? 1 : 0)}
            className="px-6 py-8 text-center text-sm text-[#8c9b8d]"
          >
            {emptyText}
          </td>
        </tr>
      ) : (
        data.map((item, index) => (
          <tr
            key={getId(item, index)}
            onClick={onRowClick ? () => onRowClick(item) : undefined}
            className={
              onRowClick ? 'cursor-pointer hover:bg-[#f5fbf5]' : undefined
            }
          >
            {columns.map((column) => (
              <td
                key={column.key}
                className={`px-6 py-4 align-middle text-sm text-[#2b322f] ${
                  column.align === 'center'
                    ? 'text-center'
                    : column.align === 'right'
                      ? 'text-right'
                      : 'text-left'
                } ${column.className || ''}`}
              >
                {column.render ? column.render(item) : item[column.key]}
              </td>
            ))}
            {rowActions ? (
              <td className="px-6 py-4 text-right text-sm text-[#2b322f]">
                {rowActions(item)}
              </td>
            ) : null}
          </tr>
        ))
      )}
    </tbody>
  );
}
