import { Suspense } from 'react';
import MockPaymentContent from './ui/mock-payment-content';

export const dynamic = 'force-dynamic';

export default function MockPaymentPage() {
  return (
    <Suspense fallback={null}>
      <MockPaymentContent />
    </Suspense>
  );
}
