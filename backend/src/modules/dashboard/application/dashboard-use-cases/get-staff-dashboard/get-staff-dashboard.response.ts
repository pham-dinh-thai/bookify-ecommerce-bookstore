import { OrderWorkloadReadModel } from '../../../domain/staff-dashboard-aggregate/read-models/order-workload.read-model';
import { TodayActivityReadModel } from '../../../domain/staff-dashboard-aggregate/read-models/today-activity.read-model';
import { BookStockAlertsReadModel } from '../../../../book-management/domain/book-aggregate/read-models/book-stock-alerts.read-model';

export class GetStaffDashboardResponse {
  public constructor(
    public readonly orderWorkload: OrderWorkloadReadModel,
    public readonly todayActivity: TodayActivityReadModel,
    public readonly stockAlerts: BookStockAlertsReadModel,
  ) {}
}
