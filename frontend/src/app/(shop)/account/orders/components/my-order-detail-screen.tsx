'use client';

import Link from 'next/link';
import { ArrowLeft, CreditCard, RefreshCw, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/shared/common/toast/toast';
import AccountSidebar from '../../components/account-sidebar';
import { useMyOrderDetail } from '../hooks/use-my-order-detail';
import {
  cancelMyOrderService,
  retryVnpayPaymentService,
} from '../services/my-orders.service';
import {
  MyOrderDetail,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '../types';

type MyOrderDetailScreenProps = {
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
  e_wallet: 'VNPay',
};

const formatDateTime = (value?: string) => {
  if (!value) return '-';

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const formatVnd = (value: number) => `${value.toLocaleString('vi-VN')} VNĐ`;

const isCancellableOrder = (order: MyOrderDetail) =>
  order.status === 'pending' || order.status === 'confirmed';

export default function MyOrderDetailScreen({ id }: MyOrderDetailScreenProps) {
  const { order, loading, error, retry } = useMyOrderDetail(id);
  const [canceling, setCanceling] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const toast = useToast();

  const cancelOrder = async () => {
    if (!order) return;

    setCanceling(true);

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
      setCanceling(false);
    }
  };

  const retryPayment = async () => {
    if (!order) return;

    setRetrying(true);

    try {
      const payment = await retryVnpayPaymentService(order.id);
      toast?.addToast('Redirecting to payment...', 'success');
      window.location.href = payment.payUrl;
    } catch (err) {
      toast?.addToast(
        err instanceof Error ? err.message : 'Failed to retry payment',
        'error',
      );
      setRetrying(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#f7faf5] text-[#2b352f]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:gap-14 lg:px-8 lg:py-14">
        <AccountSidebar activeItem="orders" />

        <div className="min-w-0 flex-1">
          <div className="mb-8 w-full max-w-4xl rounded-lg bg-white p-5 shadow-sm sm:p-6">
            <Link
              href="/account/orders"
              className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#3f6754] hover:underline"
            >
              <ArrowLeft size={16} strokeWidth={2.2} />
              Back to My Orders
            </Link>

            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-[#2b352f] sm:text-5xl">
                  Order Detail
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#58615b]">
                  Review shipment, payment and purchased books.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {order &&
                order.paymentMethod === 'e_wallet' &&
                order.paymentStatus === 'failed' ? (
                  <button
                    type="button"
                    onClick={retryPayment}
                    disabled={retrying}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#3f6754] px-5 text-sm font-bold text-[#e6ffef] transition-colors hover:bg-[#335b48] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CreditCard size={16} strokeWidth={2.2} />
                    {retrying ? 'Redirecting...' : 'Retry Payment'}
                  </button>
                ) : null}

                {order && isCancellableOrder(order) ? (
                  <button
                    type="button"
                    onClick={cancelOrder}
                    disabled={canceling}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#a83836] ring-1 ring-[#a83836]/20 transition-colors hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <XCircle size={16} strokeWidth={2.2} />
                    {canceling ? 'Canceling...' : 'Cancel Order'}
                  </button>
                ) : null}

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
              </div>
            </header>
          </div>

          {loading ? (
            <div className="w-full max-w-4xl space-y-5">
              <div className="h-44 animate-pulse rounded-lg bg-[#eff5ef] shadow-sm" />
              <div className="h-40 animate-pulse rounded-lg bg-[#eff5ef] shadow-sm" />
              <div className="h-56 animate-pulse rounded-lg bg-[#eff5ef] shadow-sm" />
            </div>
          ) : error ? (
            <div className="w-full max-w-2xl rounded-lg border border-[#a83836]/20 bg-white p-6">
              <h2 className="text-xl font-bold text-[#2b352f]">
                Order detail unavailable
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
                  href="/account/orders"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#3f6754] ring-1 ring-[#3f6754]/20 transition-colors hover:bg-[#f7faf5]"
                >
                  Back to orders
                </Link>
              </div>
            </div>
          ) : order ? (
            <OrderDetailContent order={order} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function OrderDetailContent({ order }: { order: MyOrderDetail }) {
  return (
    <div className="w-full max-w-4xl space-y-6">
      <section className="rounded-lg bg-[#eff5ef] p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 border-b border-[#d7e3d8] pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[#58615b]">Order Code</p>
            <h2 className="mt-1 text-2xl font-extrabold text-[#2b352f]">
              {order.orderCode}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#58615b]">
              Placed {formatDateTime(order.createdAt)}
            </p>
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

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Updated At" value={formatDateTime(order.updatedAt)} />
          <Info label="Total Items" value={String(order.totalItems)} />
          <Info
            label="Payment"
            value={paymentMethodLabel[order.paymentMethod]}
          />
          <Info label="Total Amount" value={formatVnd(order.totalAmount)} />
        </div>
      </section>

      <section className="rounded-lg bg-[#eff5ef] p-5 shadow-sm sm:p-6">
        <h3 className="text-xl font-bold text-[#2b352f]">
          Delivery Information
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Info label="Phone Number" value={order.phoneNumber} />
          <Info label="Shipping Address" value={order.shippingAddress} />
        </div>
      </section>

      <section className="rounded-lg bg-[#eff5ef] p-5 shadow-sm sm:p-6">
        <h3 className="text-xl font-bold text-[#2b352f]">Ordered Books</h3>

        <div className="mt-5 space-y-3">
          {order.items.length === 0 ? (
            <div className="rounded-lg bg-white px-4 py-8 text-center text-sm font-semibold text-[#58615b]">
              Order items are unavailable
            </div>
          ) : (
            order.items.map((item) => (
              <div
                key={item.id}
                className="grid gap-4 rounded-lg bg-white p-4 md:grid-cols-[72px_minmax(0,1fr)_110px_140px_140px] md:items-center"
              >
                {item.imageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-24 w-16 object-cover"
                    />
                  </>
                ) : (
                  <div className="flex h-24 w-16 items-center justify-center rounded bg-[#e2eae3] text-[10px] font-bold uppercase tracking-[0.12em] text-[#58615b]/70">
                    No cover
                  </div>
                )}

                <div className="min-w-0">
                  <p className="font-bold text-[#2b352f]">{item.title}</p>
                  <p className="mt-1 break-all text-xs font-medium text-[#58615b]">
                    Book ID: {item.productId}
                  </p>
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
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#58615b]/75">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-bold text-[#2b352f]">
        {value || '-'}
      </p>
    </div>
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
