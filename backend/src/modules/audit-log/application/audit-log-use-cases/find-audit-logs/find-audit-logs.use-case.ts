import { Inject, Injectable } from '@nestjs/common';
import {
  AUDIT_LOG_QUERY_REPOSITORY,
  type IAuditLogQueryRepository,
} from '../../../domain/audit-log-aggregate/repositories/audit-log-query.repositoy.interface';
import { AuditLogReadModel } from '../../../domain/audit-log-aggregate/read-models/audit-log.read-model';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/cache/domain/cache.repository.interface';
import { findAuditLogsResponse } from './find-audit-logs.response';
import {
  FORMAT_AUDIT_MESSAGE,
  type IFormatAuditMessage,
} from '../../../domain/audit-log-aggregate/services/format-audit-message.service';

@Injectable()
export class FindAuditLogsUseCase {
  public constructor(
    @Inject(AUDIT_LOG_QUERY_REPOSITORY)
    private readonly repository: IAuditLogQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,

    @Inject(FORMAT_AUDIT_MESSAGE)
    private readonly formatAuditMessage: IFormatAuditMessage,
  ) {}

  public async execute(): Promise<findAuditLogsResponse[]> {
    const cacheKey = 'auditLogs';

    const cached = await this.cache.get<findAuditLogsResponse[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const auditLogs = await this.repository.findAll();

    const response = auditLogs
      ? auditLogs.map(
          (auditLog) =>
            new findAuditLogsResponse(
              auditLog.id,
              auditLog.performedBy,
              this.formatAuditMessage.format(auditLog.action),
              auditLog.metadata,
              auditLog.createdAt,
            ),
        )
      : [];

    await this.cache.set(cacheKey, response);

    return response;
  }
}
