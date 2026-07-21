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
import {
  PAYMENT_GATEWAY_SERVICE,
  type IPaymentGatewayService,
} from '../../../domain/payment-gateway.service';
import { PaymentProvider } from '../../../domain/payment-transaction-aggregate/enums/payment-provider.enum';
import {
  PAYMENT_TRANSACTION_COMMAND_REPOSITORY,
  type IPaymentTransactionCommandRepository,
} from '../../../domain/payment-transaction-aggregate/repositories/payment-transaction-command.repository.interface';
import { CreatePaymentResponse } from '../create-payment/create-payment.response';

@Injectable()
export class RetryPaymentUseCase {
  public constructor(
    @Inject(ORDERS_COMMAND_REPOSITORY)
    private readonly ordersCommandRepository: IOrdersCommandRepository,

    @Inject(PAYMENT_TRANSACTION_COMMAND_REPOSITORY)
    private readonly paymentTransactionRepository: IPaymentTransactionCommandRepository,

    @Inject(PAYMENT_GATEWAY_SERVICE)
    private readonly paymentGatewayService: IPaymentGatewayService,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  public async execute(
    orderId: string,
    userId: string,
    origin?: string,
  ): Promise<CreatePaymentResponse> {
    const order: Order = await this.ordersCommandRepository.findOne(orderId);

    if (order.getUserId() !== userId) {
      throw new ForbiddenException('You cannot retry payment for this order');
    }

    if (order.getPaymentMethod() !== PaymentMethod.E_WALLET) {
      throw new BadRequestException('Order payment method is not e-wallet');
    }

    const paymentStatus = order.getPaymentStatus();

    if (
      paymentStatus !== PaymentStatus.UNPAID &&
      paymentStatus !== PaymentStatus.PENDING
    ) {
      throw new BadRequestException('Order payment is not payable');
    }

    order.markAsPending();
    await this.ordersCommandRepository.save(order);

    const amount = Math.round(order.getTotalPrice());
    const baseUrl = origin ?? process.env.VNPAY_RETURN_URL ?? `http://localhost`;

    const gatewayPayment = await this.paymentGatewayService.createPayment({
      orderId: order.getOrderCode(),
      amount,
      orderInfo: `Payment for Bookify order ${order.getOrderCode()}`,
      returnUrl: `${baseUrl}/api/payment/vnpay/return`,
    });
    const transactionId = this.uuidGenerator.generate();

    await this.paymentTransactionRepository.create({
      id: transactionId,
      orderId: order.getId(),
      provider: PaymentProvider.VNPAY,
      amount,
      providerOrderId: gatewayPayment.providerOrderId,
      payUrl: gatewayPayment.payUrl,
      rawResponse: gatewayPayment.rawResponse,
    });

    return new CreatePaymentResponse(
      transactionId,
      gatewayPayment.providerOrderId,
      gatewayPayment.payUrl,
    );
  }
}
