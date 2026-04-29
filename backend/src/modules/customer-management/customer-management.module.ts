import { Module } from '@nestjs/common';
import { CustomersController } from './presentation/customers/customers.controller';

@Module({
  controllers: [CustomersController]
})
export class CustomerManagementModule {}
