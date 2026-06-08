import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';
import { PaymentMethod } from '../../../../order/domain/order-aggregate/enums/payment-method.enum';
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
import { CreatePaymentResponse } from '../create-payment/create-payment.response';

@Injectable()
export class CreateMockPaymentUseCase {
  public constructor(
    @Inject(ORDERS_COMMAND_REPOSITORY)
    private readonly ordersCommandRepository: IOrdersCommandRepository,

    @Inject(PAYMENT_TRANSACTION_COMMAND_REPOSITORY)
    private readonly paymentTransactionRepository: IPaymentTransactionCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  public async execute(
    orderId: string,
    userId: string,
  ): Promise<CreatePaymentResponse> {
    const order: Order = await this.ordersCommandRepository.findOne(orderId);

    if (order.getUserId() !== userId) {
      throw new ForbiddenException('You cannot create payment for this order');
    }

    if (order.getPaymentMethod() !== PaymentMethod.E_WALLET) {
      throw new BadRequestException('Order payment method is not e-wallet');
    }

    if (order.getPaymentStatus() !== PaymentStatus.PENDING) {
      throw new BadRequestException('Order is not waiting for payment');
    }

    const amount = Math.round(order.getTotalPrice());
    const transactionId = this.uuidGenerator.generate();
    const providerOrderId = `MOCK-${order.getOrderCode()}-${Date.now()}`;
    const payUrl = this.createPayUrl(transactionId);

    await this.paymentTransactionRepository.create({
      id: transactionId,
      orderId: order.getId(),
      provider: PaymentProvider.MOCK,
      amount,
      providerOrderId,
      payUrl,
      rawResponse: {
        provider: PaymentProvider.MOCK,
        providerOrderId,
        payUrl,
      },
    });

    return new CreatePaymentResponse(transactionId, providerOrderId, payUrl);
  }

  private createPayUrl(transactionId: string): string {
    const baseUrl =
      process.env.MOCK_PAYMENT_URL ?? 'http://localhost/payment/mock';
    const url = new URL(baseUrl);

    url.searchParams.set('transactionId', transactionId);

    return url.toString();
  }
}
