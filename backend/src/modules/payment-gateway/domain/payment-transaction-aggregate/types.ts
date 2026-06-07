import { PaymentProvider } from './enums/payment-provider.enum';
import { PaymentTransactionStatus } from './enums/payment-transaction-status.enum';

export type CreatePaymentTransactionProps = {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  amount: number;
  currency?: string;
  providerOrderId: string;
  providerTransactionId?: string | null;
  payUrl?: string | null;
  rawResponse?: Record<string, any> | null;
  status?: PaymentTransactionStatus;
};

export type CompletePaymentTransactionProps = {
  providerTransactionId?: string | null;
  rawResponse?: Record<string, any> | null;
};
