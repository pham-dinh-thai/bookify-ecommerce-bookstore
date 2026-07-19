'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  Copy,
  QrCode,
  ShieldCheck,
  Smartphone,
  XCircle,
} from 'lucide-react';
import { Suspense, useMemo, useState, useSyncExternalStore } from 'react';
import { useToast } from '@/shared/common/toast/toast';
import { completeMockPaymentService } from '../../checkout/checkout.service';
import { createQrSvgPath, type QrSvgPath } from './qr';

function MockPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const transactionId = searchParams.get('transactionId') ?? '';
  const [submitting, setSubmitting] = useState<'succeed' | 'fail' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const browserOrigin = useSyncExternalStore(
    subscribeToOrigin,
    getBrowserOrigin,
    getServerOrigin,
  );
  const appOrigin = useMemo(
    () =>
      resolveAppOrigin(
        process.env.NEXT_PUBLIC_APP_URL?.trim() ?? '',
        browserOrigin,
      ),
    [browserOrigin],
  );

  const scanUrl = useMemo(() => {
    if (!transactionId || !appOrigin) return '';

    const url = new URL('/payment/mock/scan', appOrigin);
    url.searchParams.set('transactionId', transactionId);

    return url.toString();
  }, [appOrigin, transactionId]);

  const qrCode = useMemo<QrSvgPath | null>(
    () => (scanUrl ? createQrSvgPath(scanUrl) : null),
    [scanUrl],
  );

  const shortTransactionId = transactionId
    ? `${transactionId.slice(0, 8).toUpperCase()}-${transactionId.slice(-6).toUpperCase()}`
    : 'MISSING';

  const copyTransactionId = async () => {
    if (!transactionId) return;

    await navigator.clipboard.writeText(transactionId);
    toast?.addToast('Transaction copied', 'success');
  };

  const completePayment = async (result: 'succeed' | 'fail') => {
    if (!transactionId) {
      setError('Payment transaction is missing.');
      return;
    }

    setSubmitting(result);
    setError(null);

    try {
      await completeMockPaymentService(transactionId, result);
      toast?.addToast(
        result === 'succeed' ? 'Payment completed' : 'Payment failed',
        result === 'succeed' ? 'success' : 'error',
      );
      router.push('/account/orders');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to complete payment.';
      setError(message);
      toast?.addToast(message, 'error');
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <section className="min-h-screen bg-[#f7faf5] px-4 py-8 text-[#2b352f] sm:py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="bg-[#a50064] px-6 py-5 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">
                  Mock VNPay Gateway
                </p>
                <h1 className="mt-2 text-3xl font-extrabold">Scan QR to Pay</h1>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/15">
                <QrCode size={25} strokeWidth={2.2} />
              </span>
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[300px_1fr]">
            <div className="mx-auto w-full max-w-[300px]">
              <div className="rounded-lg border border-[#d7e3d8] bg-white p-4 shadow-sm">
                <MockQrCode qrCode={qrCode} />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#eff5ef] px-4 py-3 text-sm font-bold text-[#3f6754]">
                <Clock size={17} strokeWidth={2.2} />
                Expires in 15 minutes
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="space-y-4">
                <InfoRow label="Merchant" value="Bookify Bookstore" />
                <InfoRow label="Payment method" value="VNPay QR" />
                <InfoRow label="Amount" value="Mock checkout amount" strong />
                <div className="rounded-lg bg-[#f7faf5] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#58615b]">
                        Transaction
                      </p>
                      <p className="mt-2 break-all font-mono text-sm font-bold text-[#2b352f]">
                        {shortTransactionId}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={copyTransactionId}
                      disabled={!transactionId}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#3f6754] ring-1 ring-[#d7e3d8] transition-colors hover:bg-[#eff5ef] disabled:cursor-not-allowed disabled:opacity-50"
                      title="Copy transaction ID"
                    >
                      <Copy size={17} strokeWidth={2.2} />
                    </button>
                  </div>
                </div>
              </div>

              {error ? (
                <div className="mt-5 rounded-lg border border-[#a83836]/20 bg-[#fff5f5] px-4 py-3 text-sm font-semibold text-[#67040d]">
                  {error}
                </div>
              ) : null}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={Boolean(submitting)}
                  onClick={() => completePayment('succeed')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3f6754] px-5 py-3 text-sm font-bold text-[#e6ffef] transition-colors hover:bg-[#335b48] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle2 size={18} strokeWidth={2.2} />
                  {submitting === 'succeed' ? 'Processing...' : 'Paid'}
                </button>
                <button
                  type="button"
                  disabled={Boolean(submitting)}
                  onClick={() => completePayment('fail')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#a83836] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#8f2d2b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <XCircle size={18} strokeWidth={2.2} />
                  {submitting === 'fail' ? 'Processing...' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold">Payment Instructions</h2>
          <div className="mt-5 space-y-4">
            <Instruction
              icon={<Smartphone size={18} strokeWidth={2.2} />}
              title="Open VNPay"
              text="Use the scan feature in your wallet app."
            />
            <Instruction
              icon={<QrCode size={18} strokeWidth={2.2} />}
              title="Scan QR"
              text="The QR code is generated from this mock transaction."
            />
            <Instruction
              icon={<ShieldCheck size={18} strokeWidth={2.2} />}
              title="Confirm Result"
              text="Choose Paid or Cancel to simulate gateway confirmation."
            />
          </div>

          <Link
            href="/account/orders"
            className="mt-6 inline-flex text-sm font-bold text-[#3f6754] hover:underline"
          >
            Back to orders
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={null}>
      <MockPaymentContent />
    </Suspense>
  );
}

function subscribeToOrigin() {
  return () => {};
}

function getBrowserOrigin() {
  return window.location.origin;
}

function getServerOrigin() {
  return '';
}

function resolveAppOrigin(configuredOrigin: string, browserOrigin: string) {
  if (!browserOrigin) return '';
  if (!configuredOrigin) return browserOrigin;

  try {
    const configuredUrl = new URL(configuredOrigin);
    const browserUrl = new URL(browserOrigin);
    const configuredIsLocalhost = isLocalhost(configuredUrl.hostname);
    const browserIsLocalhost = isLocalhost(browserUrl.hostname);

    return configuredIsLocalhost && !browserIsLocalhost
      ? browserOrigin
      : configuredOrigin;
  } catch {
    return browserOrigin;
  }
}

function isLocalhost(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function MockQrCode({ qrCode }: { qrCode: QrSvgPath | null }) {
  const size = qrCode?.size ?? 1;
  const quietZone = 4;

  return (
    <svg
      viewBox={`${-quietZone} ${-quietZone} ${size + quietZone * 2} ${size + quietZone * 2}`}
      className="aspect-square w-full rounded-md bg-white p-2"
      aria-label="Mock payment QR code"
    >
      {qrCode ? <path d={qrCode.path} fill="#2b352f" /> : null}
    </svg>
  );
}

function InfoRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#edf2ee] pb-3">
      <span className="text-sm font-semibold text-[#58615b]">{label}</span>
      <span
        className={
          strong
            ? 'text-right text-lg font-extrabold text-[#a50064]'
            : 'text-right text-sm font-bold text-[#2b352f]'
        }
      >
        {value}
      </span>
    </div>
  );
}

function Instruction({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg bg-[#f7faf5] p-4">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#a50064]">
        {icon}
      </span>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-sm leading-5 text-[#58615b]">{text}</p>
      </div>
    </div>
  );
}
