'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

export interface SelectOption {
  id: string;
  name: string;
}

interface SearchSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputClassName?: string;
  inputStyle?: React.CSSProperties;
  error?: string;
}

export default function SearchSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  inputClassName = '',
  inputStyle,
  error,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.id === value);

  const filtered = query.trim()
    ? options.filter((o) => o.name.toLowerCase().includes(query.toLowerCase()))
    : options;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setQuery('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSelect = (option: SelectOption) => {
    onChange(option.id);
    setOpen(false);
    setQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={
          open
            ? () => {
                setOpen(false);
                setQuery('');
              }
            : handleOpen
        }
        className={`${inputClassName} w-full text-left flex items-center justify-between pr-10`}
        style={inputStyle}
      >
        <span style={{ color: selected ? undefined : '#9ca3af' }}>
          {selected ? selected.name : placeholder}
        </span>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {selected && (
            <span
              role="button"
              onClick={handleClear}
              className="p-0.5 rounded hover:bg-black/10 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" style={{ color: '#58615b' }} />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            style={{ color: '#58615b' }}
          />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden shadow-lg border"
          style={{
            background: (inputStyle?.background as string) ?? 'white',
            borderColor: 'rgba(0,0,0,0.1)',
            ...inputStyle,
            padding: 0,
            // reset padding from inputStyle
          }}
        >
          {/* Search input */}
          <div
            className="flex items-center gap-2 px-3 py-2 border-b"
            style={{ borderColor: 'rgba(0,0,0,0.08)' }}
          >
            <Search className="w-4 h-4 shrink-0" style={{ color: '#9ca3af' }} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: inputStyle?.color as string }}
            />
          </div>

          {/* Options list */}
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li
                className="px-4 py-3 text-sm text-center"
                style={{ color: '#9ca3af' }}
              >
                No results found
              </li>
            ) : (
              filtered.map((option) => (
                <li
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className="px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-black/5"
                  style={{
                    color: inputStyle?.color as string,
                    background:
                      option.id === value ? 'rgba(0,0,0,0.06)' : undefined,
                    fontWeight: option.id === value ? 600 : undefined,
                  }}
                >
                  {option.name}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
