import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import { PaymentStatus } from '../../../../order/domain/order-aggregate/enums/payment-status.enum';
import { Order } from '../../../../order/domain/order-aggregate/order.aggregate';
import {
  ORDERS_COMMAND_REPOSITORY,
  type IOrdersCommandRepository,
} from '../../../../order/domain/order-aggregate/repositories/orders-command.repository.interface';
import { PaymentProvider } from '../../../domain/payment-transaction-aggregate/enums/payment-provider.enum';
import { PaymentTransactionStatus } from '../../../domain/payment-transaction-aggregate/enums/payment-transaction-status.enum';
import { PaymentTransactionReadModel } from '../../../domain/payment-transaction-aggregate/read-models/payment-transaction.read-model';
import {
  PAYMENT_TRANSACTION_COMMAND_REPOSITORY,
  type IPaymentTransactionCommandRepository,
} from '../../../domain/payment-transaction-aggregate/repositories/payment-transaction-command.repository.interface';

type MockPaymentResult = 'succeeded' | 'failed';

@Injectable()
export class CompleteMockPaymentUseCase {
  public constructor(
    @Inject(ORDERS_COMMAND_REPOSITORY)
    private readonly ordersCommandRepository: IOrdersCommandRepository,

    @Inject(PAYMENT_TRANSACTION_COMMAND_REPOSITORY)
    private readonly paymentTransactionRepository: IPaymentTransactionCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async succeed(transactionId: string, userId: string): Promise<void> {
    await this.complete(transactionId, userId, 'succeeded');
  }

  public async scanSucceed(transactionId: string): Promise<void> {
    await this.complete(transactionId, null, 'succeeded');
  }

  public async fail(transactionId: string, userId: string): Promise<void> {
    await this.complete(transactionId, userId, 'failed');
  }

  private async complete(
    transactionId: string,
    userId: string | null,
    result: MockPaymentResult,
  ): Promise<void> {
    const transaction = await this.findMockTransaction(transactionId);
    const order: Order = await this.ordersCommandRepository.findOne(
      transaction.orderId,
    );

    if (userId && order.getUserId() !== userId) {
      throw new ForbiddenException('You cannot complete this payment');
    }

    if (transaction.status === PaymentTransactionStatus.PAID) {
      return;
    }

    if (order.getPaymentStatus() === PaymentStatus.PAID) {
      return;
    }

    if (order.getPaymentStatus() !== PaymentStatus.PENDING) {
      throw new BadRequestException('Order is not waiting for payment');
    }

    await this.unitOfWork.execute(async () => {
      if (result === 'succeeded') {
        order.markAsPaid();
        await this.ordersCommandRepository.save(order);
        await this.paymentTransactionRepository.markAsPaid(transaction.id, {
          providerTransactionId: `MOCK-${Date.now()}`,
          rawResponse: { result },
        });

        return;
      }

      order.markAsFailed();
      await this.ordersCommandRepository.save(order);
      await this.paymentTransactionRepository.markAsFailed(transaction.id, {
        providerTransactionId: `MOCK-${Date.now()}`,
        rawResponse: { result },
      });
    });
  }

  private async findMockTransaction(
    transactionId: string,
  ): Promise<PaymentTransactionReadModel> {
    const transaction =
      await this.paymentTransactionRepository.findById(transactionId);

    if (!transaction) {
      throw new NotFoundException('Payment transaction is not found');
    }

    if (transaction.provider !== PaymentProvider.MOCK) {
      throw new BadRequestException('Payment transaction is not mock provider');
    }

    return transaction;
  }
}
