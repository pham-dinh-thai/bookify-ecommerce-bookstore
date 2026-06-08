'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { scanSucceedMockPaymentService } from '../../../checkout/checkout.service';

export default function MockPaymentScanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transactionId') ?? '';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    queueMicrotask(async () => {
      if (!transactionId) {
        setError('Payment transaction is missing.');
        return;
      }

      try {
        await scanSucceedMockPaymentService(transactionId);
        if (!isActive) return;

        router.replace('/account/orders');
      } catch (err) {
        if (!isActive) return;

        setError(
          err instanceof Error ? err.message : 'Unable to confirm payment.',
        );
      }
    });

    return () => {
      isActive = false;
    };
  }, [router, transactionId]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f7faf5] px-4 text-[#2b352f]">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-sm">
        {error ? (
          <>
            <p className="text-sm font-bold text-[#a83836]">{error}</p>
            <p className="mt-2 text-sm text-[#58615b]">
              Return to checkout and create a new mock payment.
            </p>
          </>
        ) : (
          <>
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#eff5ef] text-[#3f6754]">
              <LoaderCircle className="animate-spin" size={24} />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold">Confirming Payment</h1>
            <p className="mt-2 text-sm text-[#58615b]">
              Mock QR scanned successfully. Redirecting to your orders.
            </p>
            <CheckCircle2
              className="mx-auto mt-5 text-[#3f6754]"
              size={28}
              strokeWidth={2.2}
            />
          </>
        )}
      </div>
    </section>
  );
}
