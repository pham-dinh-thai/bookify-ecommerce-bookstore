'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, RefreshCw } from 'lucide-react';
import Table from '@/shared/common/components/table/table';
import ToolBar from '@/shared/common/components/tool-bar/tool-bar';
import Paginate from '@/shared/common/components/pagination/paginate';
import OrderManagementHeader from './ui/order-management-header';
import useOrders from './hooks/use-orders';
import { Order, OrderStatus, PaymentMethod, PaymentStatus } from './types';

const pageSize = 10;

const statusLabel: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  delivering: 'Delivering',
  delivered: 'Delivered',
  completed: 'Completed',
  canceled: 'Canceled',
  refunded: 'Refunded',
};

const statusClassName: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  delivering: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
  refunded: 'bg-slate-100 text-slate-700',
};

const paymentStatusLabel: Record<PaymentStatus, string> = {
  unpaid: 'Unpaid',
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
};

const paymentStatusClassName: Record<PaymentStatus, string> = {
  unpaid: 'bg-orange-100 text-orange-800',
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-slate-100 text-slate-700',
};

const paymentMethodLabel: Record<PaymentMethod, string> = {
  cash_on_delivery: 'Cash On Delivery',
  bank_transfer: 'Bank Transfer',
  card: 'Card',
  e_wallet: 'E-Wallet',
};

const formatVnd = (value: number) =>
  Number(value).toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) + ' VNĐ';

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export default function OrderManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { orders, total, loading, errors, refetch } = useOrders(
    page,
    pageSize,
    search,
  );

  const columns = [
    {
      key: 'orderCode',
      label: 'Order',
      className: 'text-[#4f6553] w-48',
      render: (item: Order) => (
        <span className="font-semibold">{item.orderCode}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created At',
      className: 'text-[#4f6553] w-44',
      render: (item: Order) => <span>{formatDateTime(item.createdAt)}</span>,
    },
    {
      key: 'totalItems',
      label: 'Items',
      align: 'center' as const,
      className: 'text-[#4f6553] w-24',
    },
    {
      key: 'totalAmount',
      label: 'Total',
      className: 'text-[#4f6553] w-40',
      render: (item: Order) => (
        <span className="font-semibold">{formatVnd(item.totalAmount)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'text-[#4f6553] w-36',
      render: (item: Order) => (
        <StatusBadge
          label={statusLabel[item.status]}
          className={statusClassName[item.status]}
        />
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      className: 'text-[#4f6553] w-36',
      render: (item: Order) => (
        <StatusBadge
          label={paymentStatusLabel[item.paymentStatus]}
          className={paymentStatusClassName[item.paymentStatus]}
        />
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Method',
      className: 'text-[#4f6553] w-44',
      render: (item: Order) => (
        <span>{paymentMethodLabel[item.paymentMethod]}</span>
      ),
    },
  ];

  return (
    <div>
      <div className="p-12">
        <OrderManagementHeader />

        <div className="mb-4">
          <ToolBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            actions={
              <button
                type="button"
                onClick={refetch}
                disabled={loading}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#2d6a4f] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#166244] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className={`w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            }
            variant="minimal"
            placeHolder="Search by order code, status, payment..."
          />
        </div>

        {errors ? (
          <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.message}
          </div>
        ) : null}

        <Table
          columns={columns}
          data={orders}
          rowKey="id"
          emptyText={loading ? 'Loading orders...' : 'No orders found'}
          rowActions={(item) => (
            <div className="flex items-center justify-end gap-2">
              <Link
                title="View Detail"
                href={`/staff/orders/${item.id}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#eef6ff] text-[#204877] hover:bg-[#dbe9ff]"
              >
                <ExternalLink className="w-4" />
              </Link>
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

function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
