'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ExternalLink,
  PackageSearch,
  RefreshCw,
  ShoppingBag,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/shared/common/toast/toast';
import AccountSidebar from '../../components/account-sidebar';
import { cancelMyOrderService } from '../services/my-orders.service';
import { useMyOrders } from '../hooks/use-my-orders';
import { MyOrder, OrderStatus, PaymentStatus } from '../types';

type OrderStatusFilter = 'all' | OrderStatus;

const statusLabel: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  delivering: 'Delivering',
  delivered: 'Delivered',
  completed: 'Completed',
  canceled: 'Canceled',
  refunded: 'Refunded',
};

const statusFilterOptions: { value: OrderStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'delivering', label: 'Delivering' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'canceled', label: 'Canceled' },
  { value: 'refunded', label: 'Refunded' },
];

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

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

const formatVnd = (value: number) => `${value.toLocaleString('vi-VN')} VNĐ`;

const isCancellableOrder = (order: MyOrder) =>
  order.status === 'pending' || order.status === 'confirmed';

export default function MyOrdersScreen() {
  const { orders, loading, error, retry } = useMyOrders();
  const [activeStatus, setActiveStatus] = useState<OrderStatusFilter>('all');
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const toast = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get('payment');

    if (payment === 'fail') {
      toast?.addToast(
        'Payment failed. You can retry payment from the order detail page.',
        'error',
      );
    } else if (payment === 'success') {
      toast?.addToast('Payment completed successfully!', 'success');
    } else if (payment === 'error') {
      toast?.addToast(
        'An error occurred during payment processing.',
        'error',
      );
    }
  }, [searchParams, toast]);

  const statusCounts = useMemo(() => {
    const counts: Record<OrderStatusFilter, number> = {
      all: orders.length,
      pending: 0,
      confirmed: 0,
      delivering: 0,
      delivered: 0,
      completed: 0,
      canceled: 0,
      refunded: 0,
    };

    for (const order of orders) {
      counts[order.status] += 1;
    }

    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeStatus === 'all') return orders;

    return orders.filter((order) => order.status === activeStatus);
  }, [activeStatus, orders]);

  const cancelOrder = async (order: MyOrder) => {
    setCancelingId(order.id);

    try {
      await cancelMyOrderService(order.id);
      toast?.addToast('Order canceled successfully', 'success');
      await retry();
    } catch (err) {
      toast?.addToast(
        err instanceof Error ? err.message : 'Failed to cancel order',
        'error',
      );
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <section className="min-h-screen bg-[#f7faf5] text-[#2b352f]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:gap-14 lg:px-8 lg:py-14">
        <AccountSidebar activeItem="orders" />

        <div className="min-w-0 flex-1">
          <div className="mb-8 w-full max-w-4xl rounded-lg bg-white p-5 shadow-sm sm:p-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-[#2b352f] sm:text-5xl">
                  My Orders
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#58615b]">
                  Track your recent book orders and fulfillment status.
                </p>
              </div>

              <button
                type="button"
                onClick={retry}
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#3f6754] px-5 text-sm font-bold text-[#e6ffef] transition-colors hover:bg-[#335b48] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  strokeWidth={2.2}
                  className={loading ? 'animate-spin' : ''}
                />
                Refresh
              </button>
            </header>

            {!loading && !error && orders.length > 0 ? (
              <div className="mt-6 overflow-x-auto border-t border-[#d7e3d8] pt-4">
                <div className="flex min-w-max gap-1">
                  {statusFilterOptions.map((option) => {
                    const isActive = option.value === activeStatus;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setActiveStatus(option.value)}
                        className={`flex items-center gap-2 rounded-md px-4 py-3 text-sm font-bold transition-colors ${
                          isActive
                            ? 'bg-[#c1ecd4] text-[#325947]'
                            : 'text-[#58615b] hover:bg-[#eff5ef] hover:text-[#325947]'
                        }`}
                      >
                        <span>{option.label}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            isActive
                              ? 'bg-white/80 text-[#325947]'
                              : 'bg-[#eff5ef] text-[#58615b]'
                          }`}
                        >
                          {statusCounts[option.value]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {loading ? (
            <div className="w-full max-w-4xl space-y-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-lg bg-[#eff5ef] shadow-sm"
                />
              ))}
            </div>
          ) : error ? (
            <div className="w-full max-w-4xl rounded-lg border border-[#a83836]/20 bg-white p-6">
              <h2 className="text-xl font-bold text-[#2b352f]">
                Orders unavailable
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#58615b]">{error}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={retry}
                  className="rounded-full bg-[#3f6754] px-5 py-2.5 text-sm font-bold text-[#e6ffef] transition-colors hover:bg-[#335b48]"
                >
                  Try again
                </button>
                <Link
                  href="/login"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#3f6754] ring-1 ring-[#3f6754]/20 transition-colors hover:bg-[#f7faf5]"
                >
                  Log in
                </Link>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="w-full max-w-4xl rounded-lg border border-dashed border-[#3f6754]/20 bg-white p-10 text-center">
              <ShoppingBag
                className="mx-auto mb-4 text-[#3f6754]/55"
                size={40}
              />
              <h2 className="text-2xl font-bold text-[#2b352f]">
                No orders yet
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#58615b]">
                Your orders will appear here after checkout.
              </p>
              <Link
                href="/books"
                className="mt-6 inline-flex rounded-full bg-[#3f6754] px-5 py-3 text-sm font-bold text-[#e6ffef] transition-colors hover:bg-[#335b48]"
              >
                Browse Books
              </Link>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="w-full max-w-4xl rounded-lg border border-dashed border-[#3f6754]/20 bg-white p-8 text-center">
              <PackageSearch
                className="mx-auto mb-4 text-[#3f6754]/55"
                size={38}
              />
              <h2 className="text-2xl font-bold text-[#2b352f]">
                No {statusFilterOptions
                  .find((option) => option.value === activeStatus)
                  ?.label.toLowerCase()}{' '}
                orders
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#58615b]">
                Try another order status to view more purchases.
              </p>
            </div>
          ) : (
            <div className="w-full max-w-4xl space-y-5">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  canceling={cancelingId === order.id}
                  onCancel={cancelOrder}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function OrderCard({
  order,
  canceling,
  onCancel,
}: {
  order: MyOrder;
  canceling: boolean;
  onCancel: (order: MyOrder) => void;
}) {
  const previewItems = order.previewItems.slice(0, 3);
  const hiddenItems = order.previewItems.length - previewItems.length;

  return (
    <article className="rounded-lg bg-[#eff5ef] p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 border-b border-[#d7e3d8] pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-[#2b352f]">
              {order.orderCode}
            </h2>
            <StatusBadge
              label={statusLabel[order.status]}
              className={statusClassName[order.status]}
            />
            <StatusBadge
              label={paymentStatusLabel[order.paymentStatus]}
              className={paymentStatusClassName[order.paymentStatus]}
            />
          </div>
          <p className="text-sm font-medium text-[#58615b]">
            Placed {formatDateTime(order.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/account/orders/${order.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3f6754] px-4 py-3 text-sm font-bold text-[#e6ffef] transition-colors hover:bg-[#335b48]"
          >
            View Detail
            <ExternalLink size={15} strokeWidth={2.2} />
          </Link>
          {isCancellableOrder(order) ? (
            <button
              type="button"
              onClick={() => onCancel(order)}
              disabled={canceling}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-[#a83836] ring-1 ring-[#a83836]/20 transition-colors hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <XCircle size={15} strokeWidth={2.2} />
              {canceling ? 'Canceling...' : 'Cancel'}
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {previewItems.length === 0 ? (
          <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-4 text-sm font-semibold text-[#58615b]">
            <PackageSearch size={18} strokeWidth={2.2} />
            Order items are unavailable
          </div>
        ) : (
          previewItems.map((item) => (
            <div
              key={item.id}
              className="grid gap-4 rounded-lg bg-white p-3 md:grid-cols-[56px_minmax(0,1fr)_90px_130px_130px] md:items-center"
            >
              {item.imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-20 w-14 object-cover"
                  />
                </>
              ) : (
                <div className="flex h-20 w-14 items-center justify-center rounded bg-[#e2eae3] text-[10px] font-bold uppercase tracking-[0.12em] text-[#58615b]/70">
                  No cover
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#2b352f]">
                  {item.title}
                </p>
                <p className="mt-1 text-xs font-medium text-[#58615b]">
                  Book ID: {item.id}
                </p>
              </div>

              <LineMetric label="Qty" value={`x${item.quantity}`} />
              <LineMetric label="Unit Price" value={formatVnd(item.unitPrice)} />
              <LineMetric label="Line Total" value={formatVnd(item.lineTotal)} />
            </div>
          ))
        )}

        {hiddenItems > 0 ? (
          <div className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[#58615b]">
            +{hiddenItems} more {hiddenItems === 1 ? 'book' : 'books'}
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-[#d7e3d8] pt-5 text-[#2b352f] sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-extrabold">
          x{order.totalItems} {order.totalItems === 1 ? 'item' : 'items'}
        </span>
        <span className="text-lg font-extrabold sm:text-right">
          Total: {formatVnd(order.totalAmount)}
        </span>
      </div>
    </article>
  );
}

function LineMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#58615b]/75">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-[#2b352f]">{value}</p>
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
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${className}`}
    >
      {label}
    </span>
  );
}
