'use client';

import Paginate from '@/shared/common/components/pagination/paginate';
import Table from '@/shared/common/components/table/table';
import useAuditLogs from './hooks/use-audit-logs';
import usePaginate from '../users/(features)/(user-management)/hooks/use-paginate';
import { type AuditLog } from './types';

export default function AuditLog() {
  const { auditLogs } = useAuditLogs();

  const pageSize = 5;
  const { page, setPage, paginated } = usePaginate<AuditLog>({
    items: auditLogs,
    pageSize,
  });

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
            data={paginated}
            rowKey="id"
            footer={
              <Paginate
                page={page}
                pageSize={pageSize}
                total={auditLogs.length}
                onPageChange={setPage}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
