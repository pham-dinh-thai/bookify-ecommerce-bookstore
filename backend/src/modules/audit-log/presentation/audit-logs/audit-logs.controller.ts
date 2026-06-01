import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FindAuditLogsUseCase } from '../../application/audit-log-use-cases/find-audit-logs/find-audit-logs.use-case';
import { FindAuditLogsResponse } from '../../application/audit-log-use-cases/find-audit-logs/find-audit-logs.response';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/http/guards/role.guard';
import { Roles } from '../../../../shared/http/decorators/roles.decorator';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
export class AuditLogsController {
  public constructor(
    private readonly findAuditLogsUseCase: FindAuditLogsUseCase,
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
}
