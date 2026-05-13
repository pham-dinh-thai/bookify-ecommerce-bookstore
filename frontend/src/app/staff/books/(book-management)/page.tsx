'use client';

import { useState } from 'react';
import BookManagementHeader from './ui/book-management-header';
import useBooks from './hooks/use-books';
import { useToast } from '@/shared/common/toast/toast';
import Link from 'next/link';
import { Book as BookIcon, ExternalLink, Trash2 } from 'lucide-react';
import Table from '@/shared/common/components/table/table';
import Paginate from '@/shared/common/components/pagination/paginate';
import { Book } from '../types';
import ToolBar from '@/shared/common/components/tool-bar/tool-bar';

export default function BookManagementPage() {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { books, total, loading, errors, refetch } = useBooks(
    page,
    pageSize,
    search,
  );

  const columns = [
    {
      key: 'title',
      label: 'Title',
      className: 'text-[#4f6553]',
    },
    {
      key: 'publisher',
      label: 'Publisher',
      className: 'text-[#4f6553]',
    },
    {
      key: 'authors',
      label: 'Authors',
      className: 'text-[#4f6553]',
      render: (item: Book) => {
        const authors = item.authors ?? [];
        const visible = authors.slice(0, 2);
        const hidden = authors.length - 2;
        return (
          <span>
            {visible.join(', ')}
            {hidden > 0 && (
              <span className="ml-1 text-xs text-[#888]">+{hidden} more</span>
            )}
          </span>
        );
      },
    },
    {
      key: 'originalPrice',
      label: 'Original Price',
      className: 'text-[#4f6553]',
      render: (item: Book) => (
        <span>{item.originalPrice.toLocaleString('vi-VN')} VNĐ</span>
      ),
    },
  ];

  const { addToast } = useToast();

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
                  href="/admin/books/create"
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
                href={`/admin/books/${item.id}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#eef6ff] text-[#204877] hover:bg-[#dbe9ff]"
              >
                <ExternalLink className="w-4" />
              </Link>
              <button
                title="Delete Book"
                onClick={() => console.log('Delete book', item.id)}
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
    </div>
  );
}
