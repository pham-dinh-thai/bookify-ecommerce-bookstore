import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FindAuditLogsUseCase } from '../../application/audit-log-use-cases/find-audit-logs/find-audit-logs.use-case';
import { FindAuditLogsResponse } from '../../application/audit-log-use-cases/find-audit-logs/find-audit-logs.response';
import { FindTotalAuditLogUseCase } from '../../application/audit-log-use-cases/find-total-audit-log/find-total-audit-log.use-case';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/guards/role.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { FindRecentActivityUseCase } from '../../application/audit-log-use-cases/find-recent-activity/find-recent-activity.use-case';
import { AuditLogReadModel } from '../../domain/audit-log-aggregate/read-models/audit-log.read-model';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
export class AuditLogsController {
  public constructor(
    private readonly findAuditLogsUseCase: FindAuditLogsUseCase,
    private readonly findTotalAuditLogUseCase: FindTotalAuditLogUseCase,
    private readonly findRecentActivityUseCase: FindRecentActivityUseCase,
  ) {}

  @Get()
  public async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ): Promise<FindAuditLogsResponse> {
    const auditLogs = await this.findAuditLogsUseCase.execute(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );

    return auditLogs;
  }

  @Get('total')
  public async total(): Promise<number> {
    const total = await this.findTotalAuditLogUseCase.execute();

    return total;
  }

  @Get('recent')
  public async recentActivity(): Promise<AuditLogReadModel[]> {
    const auditLogs = await this.findRecentActivityUseCase.execute();

    return auditLogs;
  }
}
