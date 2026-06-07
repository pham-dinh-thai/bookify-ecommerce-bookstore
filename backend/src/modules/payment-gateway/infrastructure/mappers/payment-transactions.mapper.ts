import { PaymentTransactionStatus } from '../../domain/payment-transaction-aggregate/enums/payment-transaction-status.enum';
import { PaymentTransactionReadModel } from '../../domain/payment-transaction-aggregate/read-models/payment-transaction.read-model';
import { CreatePaymentTransactionProps } from '../../domain/payment-transaction-aggregate/types';
import { PaymentTransactionTypeOrm } from '../entities/payment-transaction.entity';

export class PaymentTransactionsMapper {
  public static toTypeOrm(
    props: CreatePaymentTransactionProps,
  ): PaymentTransactionTypeOrm {
    const transaction = new PaymentTransactionTypeOrm();

    transaction.id = props.id;
    transaction.orderId = props.orderId;
    transaction.provider = props.provider;
    transaction.status = props.status ?? PaymentTransactionStatus.PENDING;
    transaction.amount = props.amount;
    transaction.currency = props.currency ?? 'VND';
    transaction.providerOrderId = props.providerOrderId;
    transaction.providerTransactionId = props.providerTransactionId ?? null;
    transaction.payUrl = props.payUrl ?? null;
    transaction.rawResponse = props.rawResponse ?? null;

    return transaction;
  }

  public static toReadModel(
    transaction: PaymentTransactionTypeOrm,
  ): PaymentTransactionReadModel {
    return new PaymentTransactionReadModel(
      transaction.id,
      transaction.orderId,
      transaction.provider,
      transaction.status,
      Number(transaction.amount),
      transaction.currency,
      transaction.providerOrderId,
      transaction.providerTransactionId,
      transaction.payUrl,
      transaction.rawResponse,
      transaction.createdAt,
      transaction.updatedAt,
    );
  }
}
