import {
  BadRequestException,
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
import {
  PAYMENT_TRANSACTION_COMMAND_REPOSITORY,
  type IPaymentTransactionCommandRepository,
} from '../../../domain/payment-transaction-aggregate/repositories/payment-transaction-command.repository.interface';

@Injectable()
export class CompleteVnpayPaymentUseCase {
  public constructor(
    @Inject(ORDERS_COMMAND_REPOSITORY)
    private readonly ordersCommandRepository: IOrdersCommandRepository,

    @Inject(PAYMENT_TRANSACTION_COMMAND_REPOSITORY)
    private readonly paymentTransactionRepository: IPaymentTransactionCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async succeed(
    providerOrderId: string,
    providerTransactionId: string,
  ): Promise<void> {
    const transaction = await this.paymentTransactionRepository.findByProviderOrderId(
      PaymentProvider.VNPAY,
      providerOrderId,
    );

    if (!transaction) {
      throw new NotFoundException('VNPay transaction not found');
    }

    const order: Order = await this.ordersCommandRepository.findOne(
      transaction.orderId,
    );

    if (order.getPaymentStatus() === PaymentStatus.PAID) {
      return;
    }

    if (order.getPaymentStatus() !== PaymentStatus.PENDING) {
      throw new BadRequestException('Order is not payable in its current state');
    }

    await this.unitOfWork.execute(async () => {
      order.markAsPaid();
      await this.ordersCommandRepository.save(order);
      await this.paymentTransactionRepository.markAsPaid(transaction.id, {
        providerTransactionId,
        rawResponse: { provider: PaymentProvider.VNPAY },
      });
    });
  }

  public async fail(providerOrderId: string): Promise<void> {
    const transaction = await this.paymentTransactionRepository.findByProviderOrderId(
      PaymentProvider.VNPAY,
      providerOrderId,
    );

    if (!transaction) {
      return;
    }

    const order: Order = await this.ordersCommandRepository.findOne(
      transaction.orderId,
    );

    if (order.getPaymentStatus() !== PaymentStatus.PENDING) {
      return;
    }
  }
}
