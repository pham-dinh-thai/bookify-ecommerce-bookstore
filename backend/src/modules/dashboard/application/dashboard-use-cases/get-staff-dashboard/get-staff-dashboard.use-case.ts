import { Inject, Injectable } from '@nestjs/common';
import {
  type IOrdersQueryRepository,
  ORDERS_QUERY_REPOSITORY,
} from '../../../../order/domain/order-aggregate/repositories/orders-query.repository.interface';
import {
  AUDIT_LOG_QUERY_REPOSITORY,
  type IAuditLogQueryRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-query.repositoy.interface';
import { GetStaffDashboardResponse } from './get-staff-dashboard.response';
import { OrderWorkloadReadModel } from '../../../domain/staff-dashboard-aggregate/read-models/order-workload.read-model';
import { TodayActivityReadModel } from '../../../domain/staff-dashboard-aggregate/read-models/today-activity.read-model';

/**
 * TODO: Staff dashboard implementation checklist
 *
 * 2. Today activity
 *    - Count orders placed today.
 *    - Count orders confirmed today if status history/audit data is available.
 *    - Count orders delivered today if status history/audit data is available.
 *    - Count orders completed today if status history/audit data is available.
 *    - Count orders canceled today if status history/audit data is available.
 *    - If the order table does not track status transition timestamps, use
 *      audit-log events or keep this section limited to "placed today" first.
 *
 * 3. Stock alerts
 *    - Add a book query read model for low-stock and out-of-stock counts.
 *    - Count out-of-stock books.
 *    - Count low-stock books using an agreed threshold, for example quantity <= 5.
 *    - Optionally include a small list of low-stock books for quick action.
 *
 * 4. Recent orders
 *    - Reuse or add an order query for the latest 5-10 orders.
 *    - Include order code, status, payment status, total amount, createdAt.
 *    - Keep enough data for a direct link to staff order detail.
 *
 * 5. Quick actions
 *    - Return route metadata only if the frontend needs it.
 *    - Suggested actions: Order Management, Import Stock, Book Management,
 *      Customer Directory.
 *
 * 6. Response contract
 *    - Shape response around staff operations, not admin system totals.
 *    - Suggested top-level fields:
 *      orderWorkload, todayActivity, stockAlerts, recentOrders, quickActions.
 */
@Injectable()
export class GetStaffDashboardUseCase {
  public constructor(
    @Inject(ORDERS_QUERY_REPOSITORY)
    private readonly ordersQueryRepository: IOrdersQueryRepository,

    @Inject(AUDIT_LOG_QUERY_REPOSITORY)
    private readonly auditLogQueryRepository: IAuditLogQueryRepository,
  ) {}

  public async execute(): Promise<GetStaffDashboardResponse> {
    const orderWorkload = await this.getOrderWorkload();
    const todayActivity = await this.getTodayActivity();

    return new GetStaffDashboardResponse(orderWorkload, todayActivity);
  }

  private async getOrderWorkload(): Promise<OrderWorkloadReadModel> {
    const workload = await this.ordersQueryRepository.countWorkload();

    const orderWorkload = new OrderWorkloadReadModel(
      workload.pending,
      workload.confirmed,
      workload.delivering,
      workload.unpaidCod,
      workload.deliveredUnpaid,
    );

    return orderWorkload;
  }

  private async getTodayActivity(): Promise<TodayActivityReadModel> {
    const activity =
      await this.auditLogQueryRepository.countTodayOrderActivity();

    return new TodayActivityReadModel(
      activity.placed,
      activity.confirmed,
      activity.delivered,
      activity.completed,
      activity.canceled,
    );
  }
}
