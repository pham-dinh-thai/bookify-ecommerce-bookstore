import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

type Option = {
  id: string;
  name: string;
};

type TagPickerProps = {
  options: Option[];
  selected: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  inputClassName?: string;
  inputStyle?: React.CSSProperties;
};

export default function TagPicker({
  options,
  selected,
  onChange,
  placeholder = 'Search...',
  inputClassName,
  inputStyle,
}: TagPickerProps) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = options.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.includes(o.id),
  );

  const selectedOptions = options.filter((o) => selected.includes(o.id));

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  };

  return (
    <div ref={ref} className="relative">
      <div
        className={`flex items-center justify-between cursor-pointer ${inputClassName}`}
        style={inputStyle}
        onClick={() => setOpen((prev) => !prev)}
      >
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onClick={(e) => e.stopPropagation()}
          placeholder={placeholder}
          className="flex-1 outline-none bg-transparent text-sm"
        />
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </div>

      {open && (
        <div
          className="absolute z-50 w-full mt-2 bg-white overflow-auto"
          style={{
            border: '1.5px solid #c8d5ca',
            borderRadius: '16px',
            maxHeight: '200px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 px-4 py-3">No results found</p>
          ) : (
            filtered.map((option) => (
              <div
                key={option.id}
                onClick={() => {
                  toggle(option.id);
                  setSearch('');
                }}
                className="px-4 py-2.5 text-sm cursor-pointer hover:bg-[#f0f5f1] transition-colors"
                style={{ color: '#2b352f' }}
              >
                {option.name}
              </div>
            ))
          )}
        </div>
      )}

      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedOptions.map((option) => (
            <span
              key={option.id}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full"
              style={{
                background: '#e8f0ea',
                color: '#2d6a4f',
                border: '1px solid #c8d5ca',
              }}
            >
              {option.name}
              <button
                type="button"
                onClick={() => toggle(option.id)}
                className="hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
