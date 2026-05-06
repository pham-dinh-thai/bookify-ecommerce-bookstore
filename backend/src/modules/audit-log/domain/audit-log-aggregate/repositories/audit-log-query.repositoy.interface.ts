import { AuditLogReadModel } from '../read-models/audit-log.read-model';

export interface IAuditLogQueryRepository {
  findAll(): Promise<AuditLogReadModel[]>;

  recentActivity(): Promise<AuditLogReadModel[]>;

  count(): Promise<number>;
}

export const AUDIT_LOG_QUERY_REPOSITORY = 'IAuditLogQueryRepository';
