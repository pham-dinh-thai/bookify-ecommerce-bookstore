import { OrderWorkloadReadModel } from '../../../domain/staff-dashboard-aggregate/read-models/order-workload.read-model';
import { TodayActivityReadModel } from '../../../domain/staff-dashboard-aggregate/read-models/today-activity.read-model';
import { BookStockAlertsReadModel } from '../../../../book-management/domain/read-models/book-stock-alerts.read-model';
import { RecentOrderReadModel } from '../../../domain/staff-dashboard-aggregate/read-models/recent-order.read-model';
import { QuickActionReadModel } from '../../../domain/staff-dashboard-aggregate/read-models/quick-action.read-model';

export class GetStaffDashboardResponse {
  public constructor(
    public readonly orderWorkload: OrderWorkloadReadModel,
    public readonly todayActivity: TodayActivityReadModel,
    public readonly stockAlerts: BookStockAlertsReadModel,
    public readonly recentOrders: RecentOrderReadModel[],
    public readonly quickActions: QuickActionReadModel[],
  ) {}
}
