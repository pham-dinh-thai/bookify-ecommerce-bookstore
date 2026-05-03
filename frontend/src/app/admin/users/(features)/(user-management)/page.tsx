'use client';

import { CircleOff, Funnel, Pencil, Trash2, UserRoundPlus } from 'lucide-react';
import useUsers from '../../hooks/use-users';
import useUsersFilter from '../../hooks/use-users-filter';
import Link from 'next/link';
import AdminSearchBar from '../../ui/search-bar';
import Table from '@/shared/common/components/table/table';
import Paginate from '@/shared/common/components/pagination/paginate';

export default function Users() {
  const { users } = useUsers();
  const pageSize = 4;
  const { search, setSearch, page, setPage, filteredUsers, paginatedUsers } =
    useUsersFilter({ users, pageSize });

  const columns = [
    {
      key: 'name',
      label: 'User Identity',
      render: (item: any) => (
        <div className="space-y-1">
          <p className="font-semibold text-[#1c3725]">{item.name}</p>
          <p className="text-sm text-[#6d7f72]">{item.email}</p>
        </div>
      ),
      className: 'max-w-[320px]',
    },
    { key: 'gender', label: 'Gender', className: 'text-[#4f6553]' },
    { key: 'role', label: 'Role', className: 'text-[#4f6553]' },
    {
      key: 'status',
      label: 'Status',
      className: 'text-[#4f6553]',
    },
  ];

  return (
    <div>
      <div className="p-12">
        <div>
          <h2
            className="text-5xl font-extrabold tracking-tighter mb-6 leading-[1.1]"
            style={{ color: '#2b352f' }}
          >
            <span className="italic" style={{ color: '#335b48' }}>
              User Management
            </span>
          </h2>
        </div>
        <AdminSearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          actions={
            <>
              <button
                type="button"
                onClick={() => console.log('Filter clicked')}
                className="inline-flex items-center gap-2 h-12 rounded-full bg-[#eef6ff] px-4 py-2 text-sm font-semibold text-[#204877] hover:bg-[#dbe9ff] transition-colors"
              >
                <Funnel className="w-4" /> Filter
              </button>
              <Link
                href="/admin/users/create"
                className="inline-flex items-center gap-2 h-12 rounded-full bg-[#2d6a4f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166244] transition-colors"
              >
                <UserRoundPlus className="w-4" /> Create User
              </Link>
            </>
          }
        />

        <Table
          columns={columns}
          data={paginatedUsers}
          rowKey="id"
          rowActions={(item) => (
            <div className="flex items-center justify-end gap-2">
              <Link
                title="Edit User"
                href={`/admin/users/${item.id}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#eef6ff] text-[#204877] hover:bg-[#dbe9ff]"
              >
                <Pencil className="w-4" />
              </Link>
              <button
                type="button"
                title="Deactivate User"
                onClick={() => console.log('Delete', item.id)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f1] text-[#b33a3a] hover:bg-[#ffdede]"
              >
                <CircleOff className="w-4" />
              </button>
            </div>
          )}
          footer={
            <Paginate
              page={page}
              pageSize={pageSize}
              total={filteredUsers.length}
              onPageChange={setPage}
            />
          }
        />
      </div>
    </div>
  );
}
