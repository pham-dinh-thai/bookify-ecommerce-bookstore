'use client';

import Paginate from '@/shared/common/components/pagination/paginate';
import Table from '@/shared/common/components/table/table';
import useAuditLogs from './hooks/use-audit-logs';
import usePaginate from '../users/(features)/(user-management)/hooks/use-paginate';
import { type AuditLog } from './types';
import { useState } from 'react';

export default function AuditLog() {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { auditLogs, total, loading, errors, refetch } = useAuditLogs(
    page,
    pageSize,
    search,
  );

  const columns = [
    {
      key: 'performedBy',
      label: 'Performed By',
      className: 'max-w-[320px] text-[#4f6553]',
    },
    { key: 'message', label: 'Message', className: 'text-[#4f6553]' },
    {
      key: 'metadata',
      label: 'Metadata',
      className: 'text-[#4f6553]',
      render: (item: any) => (
        <span className="text-xs font-mono text-[#6d7f72]">
          {JSON.stringify(item.metadata)}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Created At', className: 'text-[#4f6553]' },
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
              AuditLog
            </span>
          </h2>
        </div>

        <div className="mb-4">
          <Table
            columns={columns}
            data={auditLogs}
            rowKey="id"
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
    </div>
  );
}
