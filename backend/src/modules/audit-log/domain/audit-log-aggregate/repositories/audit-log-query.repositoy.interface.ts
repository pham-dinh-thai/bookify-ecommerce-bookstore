import { AuditLogReadModel } from '../read-models/audit-log.read-model';

export type TodayOrderActivityCounts = {
  placed: number;
  confirmed: number;
  delivered: number;
  completed: number;
  canceled: number;
};

export interface IAuditLogQueryRepository {
  findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<AuditLogReadModel[]>;

  recentActivity(): Promise<AuditLogReadModel[]>;

  count(search?: string): Promise<number>;

  countTodayOrderActivity(): Promise<TodayOrderActivityCounts>;
}

export const AUDIT_LOG_QUERY_REPOSITORY = 'IAuditLogQueryRepository';
