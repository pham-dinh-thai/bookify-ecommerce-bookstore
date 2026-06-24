import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransactionTypeOrm } from './infrastructure/entities/payment-transaction.entity';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { UuidModule } from '../../shared/modules/uuid/uuid.module';
import { OrderModule } from '../order/order.module';
import { CompleteMockPaymentUseCase } from './application/use-cases/complete-mock-payment/complete-mock-payment.use-case';
import { CompleteVnpayPaymentUseCase } from './application/use-cases/complete-vnpay-payment/complete-vnpay-payment.use-case';
import { CreateMockPaymentUseCase } from './application/use-cases/create-mock-payment/create-mock-payment.use-case';
import { CreatePaymentUseCase } from './application/use-cases/create-payment/create-payment.use-case';
import { PAYMENT_GATEWAY_SERVICE } from './domain/payment-gateway.service';
import { PAYMENT_TRANSACTION_COMMAND_REPOSITORY } from './domain/payment-transaction-aggregate/repositories/payment-transaction-command.repository.interface';
import { TypeOrmPaymentTransactionCommandRepository } from './infrastructure/repositories/typeorm-payment-transaction-command.repository';
import { VnpayPaymentGatewayService } from './infrastructure/services/vnpay-payment-gateway.service';
import { PaymentController } from './presentation/payment/payment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentTransactionTypeOrm]),
    UnitOfWorkModule,
    UuidModule,
    OrderModule,
  ],
  controllers: [PaymentController],
  providers: [
    CreatePaymentUseCase,
    CreateMockPaymentUseCase,
    CompleteMockPaymentUseCase,
    CompleteVnpayPaymentUseCase,
    VnpayPaymentGatewayService,
    {
      provide: PAYMENT_GATEWAY_SERVICE,
      useExisting: VnpayPaymentGatewayService,
    },
    {
      provide: PAYMENT_TRANSACTION_COMMAND_REPOSITORY,
      useClass: TypeOrmPaymentTransactionCommandRepository,
    },
  ],
  exports: [PAYMENT_TRANSACTION_COMMAND_REPOSITORY],
})
export class PaymentGatewayModule {}
