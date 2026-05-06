import { Inject, Injectable } from '@nestjs/common';
import {
  AUDIT_LOG_QUERY_REPOSITORY,
  type IAuditLogQueryRepository,
} from '../../../domain/audit-log-aggregate/repositories/audit-log-query.repositoy.interface';
import { AuditLogReadModel } from '../../../domain/audit-log-aggregate/read-models/audit-log.read-model';
import { findRecentActivityResponse } from './find-recent-activity.response';
import {
  FORMAT_AUDIT_MESSAGE,
  type IFormatAuditMessage,
} from '../../../domain/audit-log-aggregate/services/format-audit-message.service';

@Injectable()
export class FindRecentActivityUseCase {
  public constructor(
    @Inject(AUDIT_LOG_QUERY_REPOSITORY)
    private readonly repository: IAuditLogQueryRepository,

    @Inject(FORMAT_AUDIT_MESSAGE)
    private readonly formatAuditMessage: IFormatAuditMessage,
  ) {}

  public async execute(): Promise<findRecentActivityResponse[]> {
    const auditLogs = await this.repository.recentActivity();

    return auditLogs
      ? auditLogs.map(
          (auditLog) =>
            new findRecentActivityResponse(
              auditLog.id,
              auditLog.performedBy,
              this.formatAuditMessage.format(auditLog.action),
              auditLog.metadata,
              auditLog.createdAt,
            ),
        )
      : [];
  }
}
