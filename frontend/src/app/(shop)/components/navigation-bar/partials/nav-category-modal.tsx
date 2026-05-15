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
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6 pt-24">
      <div className="absolute inset-0 bg-[#2b352f]/20 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={dropdown.ref}
        className="relative z-10 w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white/80 shadow-[0px_20px_40px_rgba(43,53,47,0.06)] backdrop-blur-[24px]"
        style={{ minHeight: 420 }}
      >
        <div className="flex">
          <div className="w-1/4 bg-[#eff5ef] p-8">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.05em] text-[#58615b]">
              Catalog
            </h3>
            <ul className="flex flex-col gap-3">
              {categories.map((cat) => {
                const key = cat.path.replace(/\//g, '') || cat.label;
                const active = selected === key;
                return (
                  <li key={cat.label}>
                    <button
                      onClick={() => setSelected(key)}
                      className={`w-full rounded-xl px-4 py-3 text-left transition-colors ${
                        active
                          ? 'bg-white text-[#2b352f]'
                          : 'text-[#58615b] hover:bg-white/70 hover:text-[#2b352f]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="w-3/4 bg-[#f7faf5] p-8">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="text-2xl font-semibold tracking-[-0.02em] text-[#2b352f]">
                {selected.charAt(0).toUpperCase() + selected.slice(1)}
              </h4>
              <button
                onClick={onClose}
                className="rounded-full px-3 py-2 text-xs uppercase tracking-[0.05em] text-[#58615b] hover:bg-white"
              >
                Close
              </button>
            </div>

            {loading ? (
              <div className="text-sm text-[#58615b]">Loading...</div>
            ) : (
              <div className="grid grid-cols-4 gap-6">
                {columns.map((col, idx) => (
                  <div key={idx}>
                    <ul className="flex flex-col gap-4">
                      {col.map((it) => (
                        <li key={it.id}>
                          <Link
                            href={`/${selected}?id=${it.id}`}
                            className="text-sm leading-7 text-[#58615b] transition-colors hover:text-[#3f6754]"
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
