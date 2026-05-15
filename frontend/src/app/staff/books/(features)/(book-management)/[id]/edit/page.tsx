'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import useBookDetail from '../../hooks/use-book-detail';
import BookFormNavigate from '../../../../components/book-form-navigate';
import { useToast } from '@/shared/common/toast/toast';

export default function EditBookBasicInfo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { book, loading, errors } = useBookDetail(id);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({ description: '', isbn: '', publisher: '', pageCount: '', language: '', genres: '' });

  useEffect(() => {
    if (!book) return;
    setFormData({
      description: book.description,
      isbn: book.isbn,
      publisher: book.publisher,
      pageCount: String(book.pageCount),
      language: book.language,
      genres: book.genres.join(', '),
    });
  }, [book]);

  if (loading) return <div className="p-12 max-w-7xl mx-auto"><div className="rounded-3xl bg-white p-12 shadow-sm border border-slate-200 animate-pulse h-[600px]" /></div>;

  if (errors || !book) {
    return <div className="p-12 max-w-7xl mx-auto"><div className="rounded-3xl bg-white p-12 shadow-sm border border-slate-200"><p className="text-base text-red-600">Unable to load book details.</p><Link href="/staff/books" className="mt-4 inline-flex items-center rounded-full bg-[#2d6a4f] px-4 py-3 text-sm font-semibold text-white hover:bg-[#23543f] transition-colors">Back to book list</Link></div></div>;
  }

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6 mb-12">
        <BookFormNavigate label="Edit Book" />
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><h1 className="text-5xl font-black tracking-tighter leading-none text-[#2b352f] mb-3">Edit Basic Information</h1><p className="text-xl font-medium text-[#58615b]">{book.title}</p></div>
          <button type="button" onClick={() => addToast('Save action is not implemented yet', 'info')} className="inline-flex items-center gap-3 rounded-xl bg-[#3f6754] px-8 py-4 text-sm font-bold text-[#e6ffef] shadow-lg shadow-[#3f6754]/10 transition-transform hover:bg-[#335b48] active:scale-[0.98]"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>Save Changes</button>
        </div>
      </div>
      <section className="rounded-3xl bg-[#f7faf5] p-10 shadow-sm border border-[#dbe5dd]"><div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><div className="col-span-1 lg:col-span-2 flex flex-col gap-3"><label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">Description</label><textarea value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} className="h-48 w-full resize-none rounded-3xl bg-white p-6 text-sm leading-relaxed text-[#58615b] ring-1 ring-[#c1ecd4] focus:outline-none" /></div><div className="flex flex-col gap-3"><label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">ISBN-13</label><input value={formData.isbn} onChange={(e) => setFormData((p) => ({ ...p, isbn: e.target.value }))} className="rounded-3xl bg-white p-4 text-sm font-medium text-[#2b352f] ring-1 ring-[#c1ecd4] focus:outline-none" /></div><div className="flex flex-col gap-3"><label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">Publisher</label><input value={formData.publisher} onChange={(e) => setFormData((p) => ({ ...p, publisher: e.target.value }))} className="rounded-3xl bg-white p-4 text-sm font-medium text-[#2b352f] ring-1 ring-[#c1ecd4] focus:outline-none" /></div><div className="flex flex-col gap-3"><label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">Page Count</label><input value={formData.pageCount} onChange={(e) => setFormData((p) => ({ ...p, pageCount: e.target.value }))} className="rounded-3xl bg-white p-4 text-sm font-medium text-[#2b352f] ring-1 ring-[#c1ecd4] focus:outline-none" /></div><div className="flex flex-col gap-3"><label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">Language</label><input value={formData.language} onChange={(e) => setFormData((p) => ({ ...p, language: e.target.value }))} className="rounded-3xl bg-white p-4 text-sm font-medium text-[#2b352f] ring-1 ring-[#c1ecd4] focus:outline-none" /></div><div className="col-span-1 lg:col-span-2 flex flex-col gap-3"><label className="text-xs font-bold uppercase tracking-[0.18em] text-[#58615b]">Genres (comma-separated)</label><input value={formData.genres} onChange={(e) => setFormData((p) => ({ ...p, genres: e.target.value }))} className="rounded-3xl bg-white p-4 text-sm font-medium text-[#2b352f] ring-1 ring-[#c1ecd4] focus:outline-none" /></div></div></section>
    </div>
  );
}
