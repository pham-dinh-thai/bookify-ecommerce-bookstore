import { Search } from 'lucide-react';

type AdminSearchBarProps = {
  value: string;
  onChange?: (value: string) => void;
  actions?: React.ReactNode;
};

export default function AdminSearchBar({
  value,
  onChange,
  actions,
}: AdminSearchBarProps) {
  return (
    <div className="flex flex-col bg-white p-6 rounded-2xl md:flex-row md:items-center gap-3 justify-between mb-6">
      <div className="flex items-center w-full max-w-2xl bg-[#f6f8f5] rounded-full px-4 h-12 border border-[#e8ede9] shadow-sm">
        <Search size={18} className="text-[#4b7761] shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Search...."
          className="w-full bg-transparent border-none outline-none text-sm text-[#2b352f] placeholder:text-[#8c9b8d] ml-3"
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        {actions}
      </div>
    </div>
  );
}
