import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransactionTypeOrm } from './infrastructure/entities/payment-transaction.entity';
import { PaymentController } from './presentation/payment/payment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTransactionTypeOrm])],
  controllers: [PaymentController],
})
export class PaymentGatewayModule {}
