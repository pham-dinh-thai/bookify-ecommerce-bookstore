'use client';

import {
  CircleCheck,
  CircleOff,
  Funnel,
  Pencil,
  Trash2,
  UserRoundPlus,
} from 'lucide-react';
import useUsers from './hooks/use-users';
import Link from 'next/link';
import Table from '@/shared/common/components/table/table';
import Paginate from '@/shared/common/components/pagination/paginate';
import { useToast } from '@/shared/common/toast/toast';
import { deactivateUserService } from './services/deactivate-user.service';
import { activateUserService } from './services/activate-user.service';
import { useEffect, useRef, useState } from 'react';
import FilterDropdown from './components/filter-dropdown';
import ToolBar from '@/shared/common/components/tool-bar/tool-bar';
import RefreshButton from '@/shared/common/components/refresh-button';

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({ role: '', status: '' });
  const [showFilter, setShowFilter] = useState(false);
  const pageSize = 10;

  const isActive =
    filter.status === 'Active'
      ? true
      : filter.status === 'Inactive'
        ? false
        : undefined;
  const roleId = filter.role || undefined;

  const { users, total, loading, refetch } = useUsers(
    page,
    pageSize,
    roleId,
    'user',
    isActive,
    search,
  );

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilter]);

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
      render: (item: any) => (
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
            item.isActive
              ? 'bg-[#f0faf4] text-[#2d6a4f]'
              : 'bg-[#fff1f1] text-[#b33a3a]'
          }`}
        >
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const { addToast } = useToast();

  return (
    <div>
      <div className="p-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2
            className="text-5xl font-extrabold tracking-tighter leading-[1.1]"
            style={{ color: '#2b352f' }}
          >
            <span className="italic" style={{ color: '#335b48' }}>
              User Management
            </span>
          </h2>
          <RefreshButton onRefresh={refetch} loading={loading} />
        </div>

        <div className="mb-4">
          <ToolBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            actions={
              <>
                <div className="relative" ref={filterRef}>
                  <button
                    type="button"
                    onClick={() => setShowFilter(!showFilter)}
                    className="inline-flex items-center gap-2 h-12 rounded-full bg-[#eef6ff] px-4 py-2 text-sm font-semibold text-[#204877] hover:bg-[#dbe9ff] transition-colors"
                  >
                    <Funnel className="w-4" /> Filter
                    {(filter.role || filter.status) && (
                      <span className="ml-1 w-2 h-2 rounded-full bg-[#b33a3a] inline-block" />
                    )}
                  </button>
                  {showFilter && (
                    <FilterDropdown
                      filter={filter}
                      setFilter={setFilter}
                      onClose={() => setShowFilter(false)}
                    />
                  )}
                </div>
                <Link
                  href="/admin/users/create"
                  className="inline-flex items-center gap-2 h-12 rounded-full bg-[#2d6a4f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166244] transition-colors"
                >
                  <UserRoundPlus className="w-4" /> Create User
                </Link>
              </>
            }
            variant="minimal"
          />
        </div>

        <Table
          columns={columns}
          data={users}
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
                title={item.isActive ? 'Deactivate User' : 'Activate User'}
                onClick={async () => {
                  try {
                    if (item.isActive) {
                      await deactivateUserService(item.id);
                      addToast('User deactivated successfully', 'success');
                    } else {
                      await activateUserService(item.id);
                      addToast('User activated successfully', 'success');
                    }
                    refetch();
                  } catch (err: unknown) {
                    let message = 'Something went wrong';

                    if (err instanceof Error) {
                      message = err.message;
                    } else if (
                      typeof err === 'object' &&
                      err !== null &&
                      'message' in err
                    ) {
                      message = String((err as any).message);
                    }

                    addToast(message, 'error');
                  }
                }}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  item.isActive
                    ? 'bg-[#fff1f1] text-[#b33a3a] hover:bg-[#ffdede]'
                    : 'bg-[#f0faf4] text-[#2d6a4f] hover:bg-[#d4eddf]'
                }`}
              >
                {item.isActive ? (
                  <CircleOff className="w-4" />
                ) : (
                  <CircleCheck className="w-4" />
                )}
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
