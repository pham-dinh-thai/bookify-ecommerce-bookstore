import { Module } from '@nestjs/common';
import { OrderManagementController } from './presentation/order-management/order-management.controller';
import { OrderModule } from '../order/order.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { UpdateOrderStatusUseCase } from './application/order-management-use-cases/update-order-status/update-order-status.use-case';
import { AuthenticationModule } from '../authentication/authentication.module';
import { FindOrdersUseCase } from './application/order-management-use-cases/find-orders/find-orders.use-case';

@Module({
  controllers: [OrderManagementController],
  imports: [
    OrderModule,
    AuditLogModule,
    UnitOfWorkModule,
    AuthenticationModule,
  ],
  providers: [FindOrdersUseCase, UpdateOrderStatusUseCase],
})
export class OrderManagementModule {}
