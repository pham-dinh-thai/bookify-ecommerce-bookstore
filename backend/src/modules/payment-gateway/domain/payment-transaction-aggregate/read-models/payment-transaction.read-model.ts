import { PaymentProvider } from '../enums/payment-provider.enum';
import { PaymentTransactionStatus } from '../enums/payment-transaction-status.enum';

export class PaymentTransactionReadModel {
  public constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly provider: PaymentProvider,
    public readonly status: PaymentTransactionStatus,
    public readonly amount: number,
    public readonly currency: string,
    public readonly providerOrderId: string,
    public readonly providerTransactionId: string | null,
    public readonly payUrl: string | null,
    public readonly rawResponse: Record<string, any> | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
