import { AuditLogReadModel } from '../../../../audit-log/domain/audit-log-aggregate/read-models/audit-log.read-model';
import { SystemTotalsReadModel } from '../../../domain/admin-dashboard-aggregate/read-models/system-totals.read-model';

export class GetAdminDashboardResponse {
  public constructor(
    public readonly systemTotals: SystemTotalsReadModel,
    public readonly recentActivities: AuditLogReadModel[],
  ) {}
}
