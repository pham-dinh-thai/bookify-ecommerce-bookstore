import { Inject, Injectable } from '@nestjs/common';
import {
  AUDIT_LOG_QUERY_REPOSITORY,
  type IAuditLogQueryRepository,
} from '../../../domain/audit-log-aggregate/repositories/audit-log-query.repositoy.interface';
import { AuditLogReadModel } from '../../../domain/audit-log-aggregate/read-models/audit-log.read-model';

@Injectable()
export class FindRecentActivityUseCase {
  public constructor(
    @Inject(AUDIT_LOG_QUERY_REPOSITORY)
    private readonly repository: IAuditLogQueryRepository,
  ) {}

  public async execute(): Promise<AuditLogReadModel[]> {
    const auditLogs = await this.repository.recentActivity();

    return auditLogs;
  }
}
