import { Controller, Get, UseGuards } from '@nestjs/common';
import { FindAuditLogsUseCase } from '../../application/audit-log-use-cases/find-audit-logs/find-audit-logs.use-case';
import { findAuditLogsResponse } from '../../application/audit-log-use-cases/find-audit-logs/find-audit-logs.response';
import { FindTotalAuditLogUseCase } from '../../application/audit-log-use-cases/find-total-audit-log/find-total-audit-log.use-case';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/guards/role.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { findRecentActivityResponse } from '../../application/audit-log-use-cases/find-recent-activity/find-recent-activity.response';
import { FindRecentActivityUseCase } from '../../application/audit-log-use-cases/find-recent-activity/find-recent-activity.use-case';

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
  public async findAll(): Promise<findAuditLogsResponse[]> {
    const auditLogs = await this.findAuditLogsUseCase.execute();

    return auditLogs;
  }

  @Get('total')
  public async total(): Promise<number> {
    const total = await this.findTotalAuditLogUseCase.execute();

    return total;
  }

  @Get('recent')
  public async recentActivity(): Promise<findRecentActivityResponse[]> {
    const auditLogs = await this.findRecentActivityUseCase.execute();

    return auditLogs;
  }
}
