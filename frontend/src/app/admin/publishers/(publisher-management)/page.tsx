'use client';

import { useToast } from '@/app/admin/components/toast/toast';
import Table from '@/shared/common/components/table/table';
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react';
import { useState } from 'react';
import Paginate from '@/shared/common/components/pagination/paginate';
import AdminSearchBar from '../../users/(features)/(user-management)/ui/search-bar';
import usePublishers from './hooks/use-publishers';
import PublisherManagementHeader from './ui/publisher-management-header';
import { createPublisherService } from './services/create-publisher.service';
import { deletePublisherService } from './services/delete-publisher.service';
import { updatePublisherService } from './services/update-publisher.service';

export default function PublisherManagement() {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { publishers, total, loading, errors, refetch } = usePublishers(
    page,
    pageSize,
    search,
  );

  const { addToast } = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const handleSaveEdit = async () => {
    if (!editingName.trim() || !editingId) return;
    try {
      await updatePublisherService(editingId, { name: editingName });
      addToast('Publisher updated successfully', 'success');
      setEditingId(null);
      refetch();
    } catch (err: any) {
      addToast(err?.message || 'Something went wrong', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePublisherService(id);
      addToast('Publisher deleted successfully', 'success');
      refetch();
    } catch (err: any) {
      addToast(err?.message || 'Something went wrong', 'error');
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await createPublisherService({ name: newName });
      addToast('Publisher created successfully', 'success');
      setNewName('');
      setIsCreating(false);
      refetch();
    } catch (err: any) {
      addToast(err?.message || 'Something went wrong', 'error');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Author Name',
      className: 'text-[#4f6553]',
      render: (item: any) =>
        editingId === item.id ? (
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            className="w-full border-none rounded-xl py-2 px-4 outline-none text-sm focus:ring-2 focus:ring-[#3f6754]/20"
            style={{ backgroundColor: '#e2eae3', color: '#2b352f' }}
            autoFocus
          />
        ) : (
          <span className="font-medium text-[#1c3725]">{item.name}</span>
        ),
    },
  ];

  return (
    <div>
      <div className="p-12">
        <PublisherManagementHeader />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="mb-4">
              {isCreating ? (
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#e8ede9]">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                      placeholder="Publisher name..."
                      className="flex-1 border-none rounded-xl py-2 px-4 outline-none text-sm focus:ring-2 focus:ring-[#3f6754]/20"
                      style={{ backgroundColor: '#e2eae3', color: '#2b352f' }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleCreate}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f0faf4] text-[#2d6a4f] hover:bg-[#d4eddf]"
                    >
                      <Check className="w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        setNewName('');
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f1] text-[#b33a3a] hover:bg-[#ffdede]"
                    >
                      <X className="w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsCreating(true)}
                    className="inline-flex items-center gap-2 h-12 rounded-full bg-[#2d6a4f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166244] transition-colors"
                  >
                    <Plus className="w-4" /> Add Publisher
                  </button>
                </div>
              )}
            </div>

            <Table
              columns={columns}
              data={publishers}
              rowKey="id"
              emptyText="No publishers found"
              rowActions={(item) => (
                <div className="flex items-center justify-end gap-2">
                  {editingId === item.id ? (
                    <>
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f0faf4] text-[#2d6a4f] hover:bg-[#d4eddf]"
                      >
                        <Check className="w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f1] text-[#b33a3a] hover:bg-[#ffdede]"
                      >
                        <X className="w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        title="Edit Genre"
                        onClick={() => handleEdit(item)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#eef6ff] text-[#204877] hover:bg-[#dbe9ff]"
                      >
                        <Pencil className="w-4" />
                      </button>
                      <button
                        type="button"
                        title="Delete Genre"
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f1] text-[#b33a3a] hover:bg-[#ffdede]"
                      >
                        <Trash2 className="w-4" />
                      </button>
                    </>
                  )}
                </div>
              )}
              footer={
                <Paginate
                  page={page}
                  pageSize={pageSize}
                  total={total}
                  onPageChange={setPage}
                />
              }
            />
          </div>

          <div className="col-span-4">
            <div className="mb-4">
              <AdminSearchBar
                value={search}
                onChange={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                actions={<></>}
                variant="minimal"
              />
            </div>

            <div className="bg-white rounded-3xl border border-[#e8ede9] p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#6d7f72] mb-6">
                Top Publishers
              </h3>

              <div className="space-y-4">
                {[
                  { name: 'Penguin Random House', count: 42 },
                  { name: 'Penguin Classics', count: 38 },
                  { name: 'Vintage Classics', count: 27 },
                  { name: 'Wordsworth Classics', count: 21 },
                  { name: 'Oxford Classics', count: 15 },
                ].map((author, index) => (
                  <div key={author.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#1c3725]">
                        {index + 1}. {author.name}
                      </span>
                      <span className="text-xs text-[#6d7f72]">
                        {author.count} books
                      </span>
                    </div>
                    <div className="w-full bg-[#f0f4f0] rounded-full h-1.5">
                      <div
                        className="bg-[#2d6a4f] h-1.5 rounded-full"
                        style={{ width: `${(author.count / 42) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#e8ede9]">
                <p className="text-xs text-[#8c9b8d] italic">
                  Fake data — connect books module later
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
