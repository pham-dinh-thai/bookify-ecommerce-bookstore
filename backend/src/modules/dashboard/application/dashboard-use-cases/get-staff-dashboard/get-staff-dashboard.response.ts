import { OrderWorkloadReadModel } from '../../../domain/staff-dashboard-aggregate/read-models/order-workload.read-model';
import { TodayActivityReadModel } from '../../../domain/staff-dashboard-aggregate/read-models/today-activity.read-model';

export class GetStaffDashboardResponse {
  public constructor(
    public readonly orderWorkload: OrderWorkloadReadModel,
    public readonly todayActivity: TodayActivityReadModel,
  ) {}
}
