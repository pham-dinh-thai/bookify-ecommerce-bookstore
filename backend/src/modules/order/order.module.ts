import { Module } from '@nestjs/common';
import { OrdersController } from './presentation/orders/orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { PlaceOrderUseCase } from './application/order-use-cases/place-order/place-order.use-case';
import { UuidModule } from '../../shared/modules/uuid/uuid.module';
import { CustomerManagementModule } from '../customer-management/customer-management.module';
import { OrderTypeOrm } from './infrastructure/entities/order.entity';
import { OrderItemTypeOrm } from './infrastructure/entities/order-item.entity';

@Module({
  controllers: [OrdersController],
  imports: [
    TypeOrmModule.forFeature([OrderTypeOrm, OrderItemTypeOrm]),
    AuthenticationModule,
    UnitOfWorkModule,
    AuditLogModule,
    UuidModule,
    CustomerManagementModule,
  ],
  providers: [PlaceOrderUseCase],
})
export class OrderModule {}
