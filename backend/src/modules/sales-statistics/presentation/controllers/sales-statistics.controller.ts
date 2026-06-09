import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/http/guards/role.guard';
import { Roles } from '../../../../shared/http/decorators/roles.decorator';
import { GetSalesStatisticsUseCase } from '../../application/use-cases/get-sales-statistics/get-sales-statistics.use-case';
import { GetSalesStatisticsResponse } from '../../application/use-cases/get-sales-statistics/get-sales-statistics.response';
import { GetSalesStatisticsRequest } from '../requests/get-sales-statistics.request';

@Controller('sales-statistics')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin', 'staff')
export class SalesStatisticsController {
  public constructor(
    private readonly getSalesStatisticsUseCase: GetSalesStatisticsUseCase,
  ) {}

  @Get()
  public async getSalesStatistics(
    @Query() query: GetSalesStatisticsRequest,
  ): Promise<GetSalesStatisticsResponse> {
    return this.getSalesStatisticsUseCase.execute(query.period, query.value);
  }
}
