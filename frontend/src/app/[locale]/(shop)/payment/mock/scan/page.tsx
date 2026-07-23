import { Suspense } from 'react';
import MockPaymentScanContent from './mock-payment-scan-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirming Mock Payment',
};

export default function MockPaymentScanPage() {
  return (
    <Suspense fallback={null}>
      <MockPaymentScanContent />
    </Suspense>
  );
}
