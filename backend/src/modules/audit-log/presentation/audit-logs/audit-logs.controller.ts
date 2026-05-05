import { Controller, Get } from '@nestjs/common';
import { FindAuditLogsUseCase } from '../../application/audit-log-use-cases/find-audit-logs/find-audit-logs.use-case';
import { findAuditLogsResponse } from '../../application/audit-log-use-cases/find-audit-logs/find-audit-logs.response';

@Controller('audit-logs')
export class AuditLogsController {
  public constructor(
    private readonly findAuditLogsUseCase: FindAuditLogsUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<findAuditLogsResponse[]> {
    const auditLogs = await this.findAuditLogsUseCase.execute();

    return auditLogs;
  }
}
