import { IsIn, IsOptional, IsString } from 'class-validator';
import type { SalesPeriod } from '../../domain/read-models/sales-statistics.read-model';

export class GetSalesStatisticsRequest {
  @IsOptional()
  @IsIn(['month', 'quarter', 'year'])
  period?: SalesPeriod;

  @IsOptional()
  @IsString()
  value?: string;
}
