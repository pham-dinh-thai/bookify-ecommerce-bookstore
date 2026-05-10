import { AuditLogReadModel } from '../../../domain/audit-log-aggregate/read-models/audit-log.read-model';

export class FindAuditLogsResponse {
  public constructor(
    public readonly auditLogs: AuditLogReadModel[],
    public readonly total: number,
  ) {}
}
