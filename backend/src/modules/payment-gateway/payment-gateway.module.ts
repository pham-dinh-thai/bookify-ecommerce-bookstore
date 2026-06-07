import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { PAYMENT_TRANSACTION_COMMAND_REPOSITORY } from './domain/payment-transaction-aggregate/repositories/payment-transaction-command.repository.interface';
import { PaymentTransactionTypeOrm } from './infrastructure/entities/payment-transaction.entity';
import { TypeOrmPaymentTransactionCommandRepository } from './infrastructure/repositories/typeorm-payment-transaction-command.repository';
import { PaymentController } from './presentation/payment/payment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentTransactionTypeOrm]),
    UnitOfWorkModule,
  ],
  controllers: [PaymentController],
  providers: [
    {
      provide: PAYMENT_TRANSACTION_COMMAND_REPOSITORY,
      useClass: TypeOrmPaymentTransactionCommandRepository,
    },
  ],
  exports: [PAYMENT_TRANSACTION_COMMAND_REPOSITORY],
})
export class PaymentGatewayModule {}
