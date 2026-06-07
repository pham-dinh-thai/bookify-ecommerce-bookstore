import { PaymentProvider } from '../enums/payment-provider.enum';
import { PaymentTransactionReadModel } from '../read-models/payment-transaction.read-model';
import {
  CompletePaymentTransactionProps,
  CreatePaymentTransactionProps,
} from '../types';

export interface IPaymentTransactionCommandRepository {
  create(props: CreatePaymentTransactionProps): Promise<void>;

  findLatestByOrderId(
    orderId: string,
    provider: PaymentProvider,
  ): Promise<PaymentTransactionReadModel | null>;

  findByProviderOrderId(
    provider: PaymentProvider,
    providerOrderId: string,
  ): Promise<PaymentTransactionReadModel | null>;

  markAsPaid(
    id: string,
    props?: CompletePaymentTransactionProps,
  ): Promise<void>;

  markAsFailed(
    id: string,
    props?: CompletePaymentTransactionProps,
  ): Promise<void>;
}

export const PAYMENT_TRANSACTION_COMMAND_REPOSITORY =
  'IPaymentTransactionCommandRepository';
