import TableBody from './ui/table-body';
import TableFooter from './ui/table-footer';
import TableHead from './ui/table-head';

type TableProps<T extends Record<string, any>> = {
  columns: (Column & { render?: (item: T) => React.ReactNode })[];
  data?: T[];
  rowKey?: string | ((item: T, index: number) => string | number);
  rowActions?: (item: T) => React.ReactNode;
  emptyText?: string;
  onRowClick?: (item: T) => void;
  footer?: React.ReactNode;
};

export default function Table<T extends Record<string, any>>({
  columns = [],
  data = [],
  rowKey = 'id',
  rowActions,
  emptyText = 'No records found',
  onRowClick,
  footer,
}: TableProps<T>) {
  const getId = (item: T, index: number) => {
    if (typeof rowKey === 'function') {
      return rowKey(item, index);
    }
    return item[rowKey] ?? index;
  };

  return (
    <div className="overflow-x-auto rounded-3xl border border-[#e8ede9] bg-white shadow-sm">
      <table className="min-w-full table-auto text-left">
        <TableHead columns={columns} rowActions={rowActions} />

        <TableBody
          data={data}
          columns={columns}
          rowActions={rowActions}
          emptyText={emptyText}
          getId={getId}
          onRowClick={onRowClick}
        />
      </table>

      {footer ? <TableFooter footer={footer} /> : null}
    </div>
  );
}
