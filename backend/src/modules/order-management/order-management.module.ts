import { Module } from '@nestjs/common';
import { OrderManagementController } from './presentation/order-management/order-management.controller';
import { OrderModule } from '../order/order.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { UpdateOrderStatusUseCase } from './application/order-management-use-cases/update-order-status/update-order-status.use-case';

@Module({
  controllers: [OrderManagementController],
  imports: [OrderModule, AuditLogModule, UnitOfWorkModule],
  providers: [UpdateOrderStatusUseCase],
})
export class OrderManagementModule {}
