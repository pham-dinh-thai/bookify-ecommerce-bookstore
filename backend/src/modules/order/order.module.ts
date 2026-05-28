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
import { ORDERS_COMMAND_REPOSITORY } from './domain/order-aggregate/repositories/orders-command.repository.interface';
import { TypeOrmOrdersCommandRepository } from './infrastructure/repositories/orders/typeorm-orders-command.repository';
import { ORDERS_QUERY_REPOSITORY } from './domain/order-aggregate/repositories/orders-query.repository.interface';
import { TypeOrmOrdersQueryRepository } from './infrastructure/repositories/orders/typeorm-orders-query.repository';

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
  providers: [
    PlaceOrderUseCase,
    {
      provide: ORDERS_COMMAND_REPOSITORY,
      useClass: TypeOrmOrdersCommandRepository,
    },
    {
      provide: ORDERS_QUERY_REPOSITORY,
      useClass: TypeOrmOrdersQueryRepository,
    },
  ],
  exports: [ORDERS_COMMAND_REPOSITORY, ORDERS_QUERY_REPOSITORY],
})
export class OrderModule {}
