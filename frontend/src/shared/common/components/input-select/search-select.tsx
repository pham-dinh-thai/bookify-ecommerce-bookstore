'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

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
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.id === value);

  const filtered = query.trim()
    ? options.filter((o) => o.name.toLowerCase().includes(query.toLowerCase()))
    : options;

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
    setQuery(selected?.name ?? '');
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
    setQuery('');
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          value={open ? query : selected?.name ?? ''}
          onFocus={() => {
            if (!open) {
              handleOpen();
            }
          }}
          onChange={(e) => {
            if (!open) {
              setOpen(true);
            }
            setQuery(e.target.value);
          }}
          placeholder={placeholder}
          className={`${inputClassName} w-full pr-14`}
          style={inputStyle}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {selected && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded hover:bg-black/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" style={{ color: '#58615b' }} />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (open) {
                setOpen(false);
                setQuery('');
                inputRef.current?.blur();
              } else {
                handleOpen();
              }
            }}
            className="p-0.5 rounded hover:bg-black/10 transition-colors"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              style={{ color: '#58615b' }}
            />
          </button>
        </div>
      </div>

      {open && (
        <div
          className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden shadow-lg border"
          style={{
            background: (inputStyle?.background as string) ?? 'white',
            borderColor: 'rgba(0,0,0,0.1)',
            padding: 0,
          }}
        >
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
                  onMouseDown={(e) => e.preventDefault()}
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
