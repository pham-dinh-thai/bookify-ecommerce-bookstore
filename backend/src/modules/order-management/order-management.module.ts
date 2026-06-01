import { Module } from '@nestjs/common';
import { OrderManagementController } from './presentation/order-management/order-management.controller';
import { OrderModule } from '../order/order.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { UpdateOrderStatusUseCase } from './application/order-management-use-cases/update-order-status/update-order-status.use-case';
import { AuthenticationModule } from '../authentication/authentication.module';
import { FindOrdersUseCase } from './application/order-management-use-cases/find-orders/find-orders.use-case';
import { FindOrderDetailUseCase } from './application/order-management-use-cases/find-order-detail/find-order-detail.use-case';
import { MarkOrderAsPaidUseCase } from './application/order-management-use-cases/mark-order-as-paid/mark-order-as-paid.use-case';

@Module({
  controllers: [OrderManagementController],
  imports: [
    OrderModule,
    AuditLogModule,
    UnitOfWorkModule,
    AuthenticationModule,
  ],
  providers: [
    FindOrdersUseCase,
    FindOrderDetailUseCase,
    UpdateOrderStatusUseCase,
    MarkOrderAsPaidUseCase,
  ],
})
export class OrderManagementModule {}
