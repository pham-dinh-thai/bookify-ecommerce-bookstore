import { Module } from '@nestjs/common';
import { OrdersController } from './presentation/orders/orders.controller';

@Module({
  controllers: [OrdersController]
})
export class OrderManagementModule {}
