'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDropdown } from '@/app/(shop)/hooks/use-dropdown';
import { allAuthorService } from '@/app/admin/authors/(author-management)/services/all-author.service';
import { allGenreService } from '@/app/admin/genres/(genre-management)/services/all-genre.service';
import { allPublisherService } from '@/app/admin/publishers/(publisher-management)/services/all-publisher.service';
import { allLanguageService } from '@/app/admin/languages/(language-management)/services/all-language.service';

type Item = { id: string; name: string };

export default function NavCategoryModal({
  open,
  onClose,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  categories: { label: string; path: string }[];
}) {
  const dropdown = useDropdown();
  const [selected, setSelected] = useState(
    categories[0]?.path.replace('/', '') || 'authors',
  );
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelected(categories[0]?.path.replace('/', '') || 'authors');
  }, [open, categories]);

  useEffect(() => {
    if (!open) return;
    const fetchItems = async () => {
      setLoading(true);
      try {
        if (selected === 'authors') {
          const res = await allAuthorService(1, 100, '');
          setItems(
            (res?.authors || []).map((a: any) => ({ id: a.id, name: a.name })),
          );
        } else if (selected === 'publishers') {
          const res = await allPublisherService(1, 100, '');
          setItems(
            (res?.publishers || []).map((p: any) => ({
              id: p.id,
              name: p.name,
            })),
          );
        } else if (selected === 'genres') {
          const res = await allGenreService(1, 100, '');
          setItems(
            (res?.genres || []).map((g: any) => ({ id: g.id, name: g.name })),
          );
        } else if (selected === 'languages') {
          const res = await allLanguageService(1, 100, '');
          setItems(
            (res?.languages || []).map((l: any) => ({
              id: l.id,
              name: l.name,
            })),
          );
        } else {
          setItems([]);
        }
      } catch (err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selected, open]);

  const cols = 4;
  const columns: Item[][] = Array.from({ length: cols }, () => []);
  items.forEach((it, i) => {
    columns[i % cols].push(it);
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        ref={dropdown.ref}
        className="relative z-10 w-full max-w-6xl rounded-3xl bg-white shadow-lg overflow-hidden"
        style={{ minHeight: 420 }}
      >
        <div className="flex">
          <div className="w-1/4 border-r border-[#eef2f7] p-6 bg-white">
            <h3 className="text-sm font-semibold text-[#334155] mb-4">
              Catalog
            </h3>
            <ul className="flex flex-col gap-2">
              {categories.map((cat) => {
                const key = cat.path.replace(/\//g, '') || cat.label;
                const active = selected === key;
                return (
                  <li key={cat.label}>
                    <button
                      onClick={() => setSelected(key)}
                      className={`w-full text-left px-4 py-3 rounded-lg ${active ? 'bg-[#f1fdf7] font-semibold text-[#065f46]' : 'text-[#475569] hover:bg-[#f8fafc]'}`}
                    >
                      {cat.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="w-3/4 p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-2xl font-bold text-[#111827]">
                {selected.charAt(0).toUpperCase() + selected.slice(1)}
              </h4>
              <button onClick={onClose} className="text-sm text-[#6b7280]">
                Close
              </button>
            </div>

            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="grid grid-cols-4 gap-6">
                {columns.map((col, idx) => (
                  <div key={idx}>
                    <ul className="flex flex-col gap-2">
                      {col.map((it) => (
                        <li key={it.id}>
                          <Link
                            href={`/${selected}?id=${it.id}`}
                            className="text-sm text-[#0f172a] hover:text-[#064e3b]"
                            onClick={onClose}
                          >
                            {it.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
