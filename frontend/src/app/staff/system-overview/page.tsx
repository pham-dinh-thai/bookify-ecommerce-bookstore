'use client';

import Link from 'next/link';
import type { ElementType } from 'react';
import {
  AlertTriangle,
  ArrowUp01,
  ArrowUpRight,
  Book,
  CheckCircle2,
  ClipboardList,
  Clock3,
  PackageCheck,
  PackageX,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  Truck,
  WalletCards,
  XCircle,
} from 'lucide-react';
import useStaffDashboard from './hooks/use-staff-dashboard';
import { OrderStatus, PaymentStatus } from '../orders/types';
import { QuickAction, RecentOrder } from './types';

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

const quickActionIcon = {
  'order-management': ShoppingBag,
  'import-stock': ArrowUp01,
  'book-management': Book,
  'customer-directory': ShoppingCart,
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

export default function StaffSystemOverviewPage() {
  const { dashboard, loading, error, refetch } = useStaffDashboard();

  const workload = dashboard?.orderWorkload;
  const activity = dashboard?.todayActivity;
  const stockAlerts = dashboard?.stockAlerts;
  const lowStockBooks = stockAlerts?.lowStockBooks ?? [];
  const recentOrders = dashboard?.recentOrders ?? [];
  const quickActions = dashboard?.quickActions ?? [];

  const workloadStats = [
    {
      label: 'Pending Orders',
      value: workload?.pendingOrders ?? 0,
      icon: Clock3,
      color: '#fff8e6',
      text: '#7a5800',
    },
    {
      label: 'Confirmed Orders',
      value: workload?.confirmedOrders ?? 0,
      icon: PackageCheck,
      color: '#eef6ff',
      text: '#204877',
    },
    {
      label: 'Delivering Orders',
      value: workload?.deliveringOrders ?? 0,
      icon: Truck,
      color: '#eef2ff',
      text: '#3730a3',
    },
    {
      label: 'Unpaid COD',
      value: workload?.unpaidCodOrders ?? 0,
      icon: WalletCards,
      color: '#fff1f1',
      text: '#b33a3a',
    },
  ];

  const activityStats = [
    {
      label: 'Placed Today',
      value: activity?.ordersPlacedToday ?? 0,
      icon: ClipboardList,
      color: '#f0faf4',
      text: '#2d6a4f',
    },
    {
      label: 'Confirmed Today',
      value: activity?.ordersConfirmedToday ?? 0,
      icon: PackageCheck,
      color: '#eef6ff',
      text: '#204877',
    },
    {
      label: 'Completed Today',
      value: activity?.ordersCompletedToday ?? 0,
      icon: CheckCircle2,
      color: '#ecfdf5',
      text: '#065f46',
    },
    {
      label: 'Canceled Today',
      value: activity?.ordersCanceledToday ?? 0,
      icon: XCircle,
      color: '#fff1f1',
      text: '#b33a3a',
    },
  ];

  return (
    <div className="p-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            className="text-5xl font-extrabold tracking-tighter leading-[1.1]"
            style={{ color: '#2b352f' }}
          >
            <span className="italic" style={{ color: '#335b48' }}>
              Staff Overview
            </span>
          </h2>
        </div>

        <button
          type="button"
          onClick={refetch}
          disabled={loading}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-[#2d6a4f] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#166244] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error.message}
        </div>
      ) : null}

      <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {workloadStats.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="rounded-2xl border border-[#e8ede9] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#6d7f72]">
              Today Activity
            </h3>
            <span className="rounded-full bg-[#f7faf5] px-3 py-1 text-xs font-semibold text-[#55735f]">
              {activity?.ordersDeliveredToday ?? 0} delivered
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {activityStats.map((stat) => (
              <MetricCard key={stat.label} {...stat} compact />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#e8ede9] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#6d7f72]">
              Stock Alerts
            </h3>
            <AlertTriangle className="h-5 w-5 text-[#b45309]" />
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <StockMetric
              label="Out of stock"
              value={stockAlerts?.outOfStockCount ?? 0}
              icon={PackageX}
              className="bg-[#fff1f1] text-[#b33a3a]"
            />
            <StockMetric
              label={`Qty <= ${stockAlerts?.lowStockThreshold ?? 5}`}
              value={stockAlerts?.lowStockCount ?? 0}
              icon={AlertTriangle}
              className="bg-[#fff8e6] text-[#7a5800]"
            />
          </div>

          <div className="space-y-2">
            {lowStockBooks.length > 0 ? (
              lowStockBooks.map((book) => (
                <Link
                  key={book.id}
                  href={`/staff/books/${book.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#eef2ea] px-3 py-2 text-sm transition-colors hover:bg-[#f7faf5]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#22352b]">
                      {book.title}
                    </p>
                    <p className="text-xs text-[#7b8d80]">{book.isbn}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#fff8e6] px-2.5 py-1 text-xs font-bold text-[#7a5800]">
                    {book.quantity}
                  </span>
                </Link>
              ))
            ) : (
              <p className="rounded-xl bg-[#f7faf5] px-3 py-3 text-sm text-[#5a6d60]">
                No low-stock books.
              </p>
            )}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-2xl border border-[#e8ede9] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#6d7f72]">
              Recent Orders
            </h3>
            <Link
              href="/staff/orders"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2d6a4f] hover:text-[#166244]"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#eef2ea]">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[1fr_8rem_8rem_8rem_10rem] gap-4 bg-[#f7faf5] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#6d7f72]">
                <span>Order</span>
                <span>Status</span>
                <span>Payment</span>
                <span>Total</span>
                <span>Created</span>
              </div>

              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <RecentOrderRow key={order.id} order={order} />
                ))
              ) : (
                <p className="px-4 py-5 text-sm text-[#5a6d60]">
                  {loading ? 'Loading orders...' : 'No recent orders.'}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#e8ede9] bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-[#6d7f72]">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <QuickActionLink key={action.key} action={action} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  color,
  text,
  compact = false,
}: {
  label: string;
  value: number;
  icon: ElementType;
  color: string;
  text: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl ${compact ? 'p-4' : 'p-6'} flex flex-col gap-3`}
      style={{ backgroundColor: color }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold" style={{ color: text }}>
          {label}
        </span>
        <Icon className="h-5 w-5 shrink-0" style={{ color: text }} />
      </div>
      <p
        className={`${compact ? 'text-2xl' : 'text-3xl'} font-extrabold`}
        style={{ color: text }}
      >
        {value}
      </p>
    </div>
  );
}

function StockMetric({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: number;
  icon: ElementType;
  className: string;
}) {
  return (
    <div className={`rounded-xl p-4 ${className}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wide">
          {label}
        </span>
        <Icon className="h-4 w-4 shrink-0" />
      </div>
      <p className="text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function RecentOrderRow({ order }: { order: RecentOrder }) {
  return (
    <Link
      href={order.detailPath}
      className="grid grid-cols-[1fr_8rem_8rem_8rem_10rem] gap-4 border-t border-[#eef2ea] px-4 py-3 text-sm text-[#405a4a] transition-colors hover:bg-[#f7faf5]"
    >
      <span className="min-w-0 truncate font-semibold text-[#22352b]">
        {order.orderCode}
      </span>
      <StatusBadge
        label={statusLabel[order.status]}
        className={statusClassName[order.status]}
      />
      <StatusBadge
        label={paymentStatusLabel[order.paymentStatus]}
        className={paymentStatusClassName[order.paymentStatus]}
      />
      <span className="font-semibold text-[#22352b]">
        {formatVnd(order.totalAmount)}
      </span>
      <span className="text-xs text-[#6d7f72]">
        {formatDateTime(order.createdAt)}
      </span>
    </Link>
  );
}

function QuickActionLink({ action }: { action: QuickAction }) {
  const Icon =
    quickActionIcon[action.key as keyof typeof quickActionIcon] ?? ArrowUpRight;

  return (
    <Link
      href={action.path}
      className="flex h-14 items-center justify-between gap-3 rounded-xl border border-[#eef2ea] px-4 text-sm font-semibold text-[#22352b] transition-colors hover:bg-[#f7faf5] hover:text-[#2d6a4f]"
    >
      <span className="flex min-w-0 items-center gap-3">
        <Icon className="h-5 w-5 shrink-0 text-[#2d6a4f]" />
        <span className="truncate">{action.label}</span>
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-[#7b8d80]" />
    </Link>
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
      className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
