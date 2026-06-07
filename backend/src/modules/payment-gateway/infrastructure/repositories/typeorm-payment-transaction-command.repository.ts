import { Injectable } from '@nestjs/common';
import { TypeOrmUnitOfWork } from '../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { PaymentProvider } from '../../domain/payment-transaction-aggregate/enums/payment-provider.enum';
import { PaymentTransactionStatus } from '../../domain/payment-transaction-aggregate/enums/payment-transaction-status.enum';
import { PaymentTransactionReadModel } from '../../domain/payment-transaction-aggregate/read-models/payment-transaction.read-model';
import { IPaymentTransactionCommandRepository } from '../../domain/payment-transaction-aggregate/repositories/payment-transaction-command.repository.interface';
import {
  CompletePaymentTransactionProps,
  CreatePaymentTransactionProps,
} from '../../domain/payment-transaction-aggregate/types';
import { PaymentTransactionTypeOrm } from '../entities/payment-transaction.entity';
import { PaymentTransactionsMapper } from '../mappers/payment-transactions.mapper';

@Injectable()
export class TypeOrmPaymentTransactionCommandRepository implements IPaymentTransactionCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async create(props: CreatePaymentTransactionProps): Promise<void> {
    await this.unitOfWork
      .getManager()
      .insert(
        PaymentTransactionTypeOrm,
        PaymentTransactionsMapper.toTypeOrm(props),
      );
  }

  public async findById(
    id: string,
  ): Promise<PaymentTransactionReadModel | null> {
    const transaction = await this.unitOfWork
      .getManager()
      .findOne(PaymentTransactionTypeOrm, { where: { id } });

    return transaction
      ? PaymentTransactionsMapper.toReadModel(transaction)
      : null;
  }

  public async findLatestByOrderId(
    orderId: string,
    provider: PaymentProvider,
  ): Promise<PaymentTransactionReadModel | null> {
    const transaction = await this.unitOfWork
      .getManager()
      .findOne(PaymentTransactionTypeOrm, {
        where: { orderId, provider },
        order: { createdAt: 'DESC' },
      });

    return transaction
      ? PaymentTransactionsMapper.toReadModel(transaction)
      : null;
  }

  public async findByProviderOrderId(
    provider: PaymentProvider,
    providerOrderId: string,
  ): Promise<PaymentTransactionReadModel | null> {
    const transaction = await this.unitOfWork
      .getManager()
      .findOne(PaymentTransactionTypeOrm, {
        where: { provider, providerOrderId },
      });

    return transaction
      ? PaymentTransactionsMapper.toReadModel(transaction)
      : null;
  }

  public async markAsPaid(
    id: string,
    props: CompletePaymentTransactionProps = {},
  ): Promise<void> {
    await this.updateStatus(id, PaymentTransactionStatus.PAID, props);
  }

  public async markAsFailed(
    id: string,
    props: CompletePaymentTransactionProps = {},
  ): Promise<void> {
    await this.updateStatus(id, PaymentTransactionStatus.FAILED, props);
  }

  private async updateStatus(
    id: string,
    status: PaymentTransactionStatus,
    props: CompletePaymentTransactionProps,
  ): Promise<void> {
    await this.unitOfWork.getManager().update(
      PaymentTransactionTypeOrm,
      { id },
      {
        status,
        providerTransactionId: props.providerTransactionId ?? null,
        rawResponse: props.rawResponse ?? null,
      },
    );
  }
}
