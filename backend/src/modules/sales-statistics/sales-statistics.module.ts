import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module';
import { OrderTypeOrm } from '../order/infrastructure/entities/order.entity';
import { OrderItemTypeOrm } from '../order/infrastructure/entities/order-item.entity';
import { GetSalesStatisticsUseCase } from './application/use-cases/get-sales-statistics/get-sales-statistics.use-case';
import { SALES_STATISTICS_QUERY_REPOSITORY } from './domain/repositories/sales-statistics-query.repository.interface';
import { TypeOrmSalesStatisticsQueryRepository } from './infrastructure/repositories/typeorm-sales-statistics-query.repository';
import { SalesStatisticsController } from './presentation/controllers/sales-statistics.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderTypeOrm, OrderItemTypeOrm]),
    AuthenticationModule,
  ],
  controllers: [SalesStatisticsController],
  providers: [
    GetSalesStatisticsUseCase,
    {
      provide: SALES_STATISTICS_QUERY_REPOSITORY,
      useClass: TypeOrmSalesStatisticsQueryRepository,
    },
  ],
})
export class SalesStatisticsModule {}
