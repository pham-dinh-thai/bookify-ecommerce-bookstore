'use client';

import { useToast } from '@/shared/common/toast/toast';
import Table from '@/shared/common/components/table/table';
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react';
import { useState } from 'react';
import Paginate from '@/shared/common/components/pagination/paginate';
import useAuthors from './hooks/use-authors';
import AuthorManagementHeader from './ui/author-management-header';
import { updateAuthorService } from './services/update-author.service';
import { deleteAuthorService } from './services/delete-author.service';
import { createAuthorService } from './services/create-author.service';
import ToolBar from '@/shared/common/components/tool-bar/tool-bar';
import RefreshButton from '@/shared/common/components/refresh-button';
import useAdminDashboard from '../../system-overview/hooks/use-admin-dashboard';

export default function AuthorManagement() {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { authors, total, loading, refetch } = useAuthors(
    page,
    pageSize,
    search,
  );
  const {
    dashboard,
    loading: dashboardLoading,
    refetch: refetchDashboard,
  } = useAdminDashboard();
  const topAuthors = dashboard?.topAuthors ?? [];
  const maxUnitsSold = Math.max(
    1,
    ...topAuthors.map((author) => author.unitsSold),
  );

  const { addToast } = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchDashboard()]);
  };

  const handleEdit = (item: Author) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const handleSaveEdit = async () => {
    if (!editingName.trim() || !editingId) return;
    try {
      await updateAuthorService(editingId, { name: editingName });
      addToast('Author updated successfully', 'success');
      setEditingId(null);
      void refetch();
      void refetchDashboard();
    } catch (err: unknown) {
      addToast(
        err instanceof Error ? err.message : 'Something went wrong',
        'error',
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAuthorService(id);
      addToast('Author deleted successfully', 'success');

      if (authors.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        void refetch();
      }
      void refetchDashboard();
    } catch (err: unknown) {
      addToast(
        err instanceof Error ? err.message : 'Something went wrong',
        'error',
      );
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await createAuthorService({ name: newName });
      addToast('Author created successfully', 'success');
      setNewName('');
      setIsCreating(false);
      void refetch();
      void refetchDashboard();
    } catch (err: unknown) {
      addToast(
        err instanceof Error ? err.message : 'Something went wrong',
        'error',
      );
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Author Name',
      className: 'text-[#4f6553]',
      render: (item: Author) =>
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
        <AuthorManagementHeader
          action={
            <RefreshButton
              onRefresh={handleRefresh}
              loading={loading || dashboardLoading}
            />
          }
        />

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
                      placeholder="Author name..."
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
                    <Plus className="w-4" /> Add Author
                  </button>
                </div>
              )}
            </div>

            <Table
              columns={columns}
              data={authors}
              rowKey="id"
              emptyText="No authors found"
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
              <ToolBar
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
                Top Authors
              </h3>

              <div className="space-y-4">
                {dashboardLoading ? (
                  <p className="text-sm text-[#6d7f72]">Loading authors...</p>
                ) : topAuthors.length > 0 ? (
                  topAuthors.map((author, index) => (
                    <div key={author.authorId}>
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="min-w-0 truncate text-sm font-medium text-[#1c3725]">
                          {index + 1}. {author.authorName}
                        </span>
                        <span className="shrink-0 text-xs text-[#6d7f72]">
                          {author.unitsSold} sold
                        </span>
                      </div>
                      <div className="w-full bg-[#f0f4f0] rounded-full h-1.5">
                        <div
                          className="bg-[#2d6a4f] h-1.5 rounded-full"
                          style={{
                            width: `${(author.unitsSold / maxUnitsSold) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#6d7f72]">
                    No author sales in the last 30 days.
                  </p>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-[#e8ede9]">
                <p className="text-xs text-[#8c9b8d] italic">
                  Ranked by units sold in the last 30 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
