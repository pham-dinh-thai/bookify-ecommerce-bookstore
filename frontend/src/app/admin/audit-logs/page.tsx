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
  const [selectedMetadata, setSelectedMetadata] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { auditLogs, total, loading, errors, refetch } = useAuditLogs(
    page,
    pageSize,
    search,
  );

  const handleViewMetadata = (metadata: any) => {
    setSelectedMetadata(metadata);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMetadata(null);
  };

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
        <button
          onClick={() => handleViewMetadata(item.metadata)}
          title="View metadata"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#335b48]/10 text-[#335b48] text-xs font-medium rounded-full border border-[#335b48]/20 hover:bg-[#335b48] hover:text-white transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View
        </button>
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

      {/* Metadata Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#2b352f]">Metadata</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <pre className="bg-gray-100 p-4 rounded-2xl text-sm font-mono text-[#4f6553] overflow-auto">
              {JSON.stringify(selectedMetadata, null, 2)}
            </pre>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-[#335b48] text-white rounded-2xl hover:bg-[#2b352f] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
