import { Module } from '@nestjs/common';
import { OrderManagementController } from './presentation/order-management/order-management.controller';

@Module({
  controllers: [OrderManagementController]
})
export class OrderManagementModule {}
