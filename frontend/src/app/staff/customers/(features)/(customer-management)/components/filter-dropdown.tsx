type FilterOptions = {
  status: string;
};

type FilterDropdownProps = {
  filter: FilterOptions;
  setFilter: (filter: FilterOptions) => void;
  onClose: () => void;
};

export default function FilterDropdown({
  filter,
  setFilter,
  onClose,
}: FilterDropdownProps) {
  return (
    <div className="absolute right-0 top-12 z-10 bg-white rounded-2xl shadow-lg border border-[#e8ede9] p-4 w-56 space-y-4">
      <div className="space-y-2">
        <label
          className="text-xs font-bold uppercase"
          style={{ color: '#58615b' }}
        >
          Status
        </label>
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="w-full rounded-xl px-3 py-2 text-sm border border-[#e8ede9]"
        >
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <button
        onClick={() => {
          setFilter({ status: '' });
          onClose();
        }}
        className="w-full text-sm text-[#b33a3a]"
      >
        Clear filter
      </button>
    </div>
  );
}
