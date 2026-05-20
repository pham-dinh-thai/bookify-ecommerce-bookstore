'use client';

import { useState } from 'react';
import BookManagementHeader from './ui/book-management-header';
import useBooks from './hooks/use-books';
import { useToast } from '@/shared/common/toast/toast';
import Link from 'next/link';
import { Book as BookIcon, ExternalLink, Trash2 } from 'lucide-react';
import Table from '@/shared/common/components/table/table';
import Paginate from '@/shared/common/components/pagination/paginate';
import { Book } from '../../types';
import ToolBar from '@/shared/common/components/tool-bar/tool-bar';
import { deleteBookService } from './services/delete-book.service';
import ConfirmDeleteModal from './components/confirm-delete-modal';

export default function BookManagementPage() {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [expandedAuthors, setExpandedAuthors] = useState<Set<string>>(
    new Set(),
  );

  const { books, total, loading, errors, refetch } = useBooks(
    page,
    pageSize,
    search,
  );

  console.log('Books:', books);

  const columns = [
    {
      key: 'book',
      label: 'Book Title',
      className: 'text-[#4f6553] w-64',
      render: (item: Book) => (
        <div className="flex items-center gap-3">
          <img
            src={
              item.covers?.find((cover) => cover.isPrimary)?.url ??
              item.covers?.[0]?.url ??
              'https://fallback-image-url'
            }
            alt={item.title}
            className="w-18 h-24 object-cover flex-shrink-0"
          />
          <span className="font-medium">{item.title}</span>
        </div>
      ),
    },
    {
      key: 'publisher',
      label: 'Publisher',
      className: 'text-[#4f6553] w-36',
    },
    {
      key: 'authors',
      label: 'Author',
      className: 'text-[#4f6553] w-72',
      render: (item: Book) => {
        const authors = item.authors ?? [];
        const isExpanded = expandedAuthors.has(item.id);
        const visible = isExpanded ? authors : authors.slice(0, 2);
        const hidden = authors.length - 2;

        return (
          <div className="flex flex-wrap gap-1">
            {visible.map((author, i) => (
              <span key={i}>
                {author}
                {i < visible.length - 1 ? ',' : ''}
              </span>
            ))}
            {!isExpanded && hidden > 0 && (
              <button
                onClick={() =>
                  setExpandedAuthors((prev) => new Set(prev).add(item.id))
                }
                className="text-xs text-[#2d6a4f] hover:underline ml-1"
              >
                +{hidden} more
              </button>
            )}
            {isExpanded && (
              <button
                onClick={() =>
                  setExpandedAuthors((prev) => {
                    const next = new Set(prev);
                    next.delete(item.id);
                    return next;
                  })
                }
                className="text-xs text-[#888] hover:underline ml-1"
              >
                less
              </button>
            )}
          </div>
        );
      },
    },
    {
      key: 'originalPrice',
      label: 'Original Price',
      className: 'text-[#4f6553] w-46',
      render: (item: Book) => (
        <span>
          {Number(item.originalPrice).toLocaleString('vi-VN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          VNĐ
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'text-[#4f6553] w-36',
      render: (item: Book) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.status === 'In Stock'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {item.status === 'In Stock' ? 'In Stock' : 'Out of Stock'}
        </span>
      ),
    },
  ];

  const { addToast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;

    try {
      setDeletingId(bookToDelete.id);
      await deleteBookService(bookToDelete.id);
      addToast('Book deleted successfully', 'success');
      await refetch();
      setBookToDelete(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete book';
      addToast(message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  console.log(books);

  return (
    <div>
      <div className="p-12">
        <BookManagementHeader />

        <div className="mb-4">
          <ToolBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            actions={
              <>
                <Link
                  href="/staff/books/create"
                  className="inline-flex items-center gap-2 h-12 rounded-full bg-[#2d6a4f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166244] transition-colors"
                >
                  <BookIcon className="w-4" /> Create Book
                </Link>
              </>
            }
            variant="minimal"
            placeHolder="Search by title, author,..."
          />
        </div>

        <Table
          columns={columns}
          data={books}
          rowKey="id"
          rowActions={(item) => (
            <div className="flex items-center justify-end gap-2">
              <Link
                title="View Detail"
                href={`/staff/books/${item.id}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#eef6ff] text-[#204877] hover:bg-[#dbe9ff]"
              >
                <ExternalLink className="w-4" />
              </Link>
              <button
                title="Delete Book"
                onClick={() => setBookToDelete(item)}
                disabled={deletingId === item.id}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff0f0] text-[#a63232] hover:bg-[#ffd9d9]"
              >
                <Trash2 className="w-4" />
              </button>
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

      <ConfirmDeleteModal
        open={Boolean(bookToDelete)}
        title={`Delete "${bookToDelete?.title ?? ''}"?`}
        description="Book will be permanently removed from system. This action cannot be undone."
        loading={Boolean(bookToDelete) && deletingId === bookToDelete?.id}
        onClose={() => {
          if (deletingId) return;
          setBookToDelete(null);
        }}
        onConfirm={handleDeleteBook}
      />
    </div>
  );
}
