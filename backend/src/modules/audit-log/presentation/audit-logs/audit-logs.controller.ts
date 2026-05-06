import { Controller, Get, UseGuards } from '@nestjs/common';
import { FindAuditLogsUseCase } from '../../application/audit-log-use-cases/find-audit-logs/find-audit-logs.use-case';
import { findAuditLogsResponse } from '../../application/audit-log-use-cases/find-audit-logs/find-audit-logs.response';
import { FindTotalAuditLogUseCase } from '../../application/audit-log-use-cases/find-total-audit-log/find-total-audit-log.use-case';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/guards/role.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
export class AuditLogsController {
  public constructor(
    private readonly findAuditLogsUseCase: FindAuditLogsUseCase,
    private readonly findTotalAuditLogUseCase: FindTotalAuditLogUseCase,
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
}
