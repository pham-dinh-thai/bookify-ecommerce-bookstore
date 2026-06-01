'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PackageCheck, RefreshCw } from 'lucide-react';
import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { findOrderService } from '../services/find-order.service';
import {
  OrderDetail,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '../types';

type OrderDetailScreenProps = {
  id: string;
};

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

const formatDateTime = (value?: string) => {
  if (!value) return '-';

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export default function OrderDetailScreen({ id }: OrderDetailScreenProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrderDetail = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!getAccessToken()) {
        await refreshAccessToken();
      }

      const orderDetail = await findOrderService(id);
      setOrder(orderDetail);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err : new Error('Failed to load order detail'),
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void Promise.resolve().then(fetchOrderDetail);
  }, [fetchOrderDetail]);

  return (
    <div className="p-12">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Link
            href="/staff/orders"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2d6a4f] hover:underline"
          >
            <ArrowLeft className="w-4" />
            Back to Order Management
          </Link>

          <h2
            className="text-5xl font-extrabold tracking-tighter leading-[1.1]"
            style={{ color: '#2b352f' }}
          >
            <span className="italic" style={{ color: '#335b48' }}>
              Order Detail
            </span>
          </h2>
        </div>

        <button
          type="button"
          onClick={fetchOrderDetail}
          disabled={loading}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-[#2d6a4f] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#166244] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error.message}
        </div>
      ) : null}

      {loading && !order ? (
        <div className="rounded-3xl border border-[#e8ede9] bg-white px-6 py-12 text-center text-sm text-[#6c7d70] shadow-sm">
          Loading order detail...
        </div>
      ) : order ? (
        <div className="space-y-6">
          <section className="rounded-3xl border border-[#e8ede9] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#eef6ff] text-[#204877]">
                  <PackageCheck className="w-7" />
                </span>
                <div>
                  <p className="text-sm font-medium text-[#6c7d70]">
                    Order Code
                  </p>
                  <h3 className="text-2xl font-bold text-[#2b352f]">
                    {order.orderCode}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusBadge
                  label={statusLabel[order.status]}
                  className={statusClassName[order.status]}
                />
                <StatusBadge
                  label={paymentStatusLabel[order.paymentStatus]}
                  className={paymentStatusClassName[order.paymentStatus]}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <Info label="Created At" value={formatDateTime(order.createdAt)} />
              <Info label="Updated At" value={formatDateTime(order.updatedAt)} />
              <Info label="Total Items" value={String(order.totalItems)} />
              <Info label="Total Amount" value={formatVnd(order.totalAmount)} />
            </div>
          </section>

          <section className="rounded-3xl border border-[#e8ede9] bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-[#2b352f]">
              Customer & Payment
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <Info label="Customer ID" value={order.userId} />
              <Info label="Phone Number" value={order.phoneNumber} />
              <Info
                label="Payment Method"
                value={paymentMethodLabel[order.paymentMethod]}
              />
              <div className="md:col-span-3">
                <Info label="Shipping Address" value={order.shippingAddress} />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#e8ede9] bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-[#2b352f]">
              Ordered Books
            </h3>

            <div className="overflow-hidden rounded-2xl border border-[#e8ede9]">
              {order.items.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-[#8c9b8d]">
                  No order items found
                </div>
              ) : (
                <div className="divide-y divide-[#eef2ea]">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1fr)_120px_150px_150px] md:items-center"
                    >
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="h-24 w-16 flex-shrink-0 object-cover"
                            />
                          </>
                        ) : (
                          <div className="flex h-24 w-16 flex-shrink-0 items-center justify-center bg-[#eef2ea] text-xs text-[#6c7d70]">
                            No cover
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-[#2b352f]">
                            {item.title}
                          </p>
                          <p className="mt-1 break-all text-xs text-[#6c7d70]">
                            {item.productId}
                          </p>
                        </div>
                      </div>

                      <LineMetric label="Qty" value={String(item.quantity)} />
                      <LineMetric
                        label="Unit Price"
                        value={formatVnd(item.unitPrice)}
                      />
                      <LineMetric
                        label="Line Total"
                        value={formatVnd(item.lineTotal)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e8ede9] bg-[#fbfdf9] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6c7d70]">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold text-[#2b352f]">
        {value || '-'}
      </p>
    </div>
  );
}

function LineMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8c9b8d]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#2b352f]">{value}</p>
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
