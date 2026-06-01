import { Inject, Injectable } from '@nestjs/common';
import {
  type IOrdersQueryRepository,
  ORDERS_QUERY_REPOSITORY,
} from '../../../../order/domain/order-aggregate/repositories/orders-query.repository.interface';
import {
  AUDIT_LOG_QUERY_REPOSITORY,
  type IAuditLogQueryRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-query.repositoy.interface';
import {
  BOOKS_QUERY_REPOSITORY,
  type IBooksQueryRepository,
} from '../../../../book-management/domain/book-aggregate/repositories/books-query.repository.interface';
import { GetStaffDashboardResponse } from './get-staff-dashboard.response';
import { OrderWorkloadReadModel } from '../../../domain/staff-dashboard-aggregate/read-models/order-workload.read-model';
import { TodayActivityReadModel } from '../../../domain/staff-dashboard-aggregate/read-models/today-activity.read-model';
import { BookStockAlertsReadModel } from '../../../../book-management/domain/book-aggregate/read-models/book-stock-alerts.read-model';

/**
 * TODO: Staff dashboard implementation checklist
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
  private static readonly LOW_STOCK_THRESHOLD = 5;
  private static readonly LOW_STOCK_BOOK_LIMIT = 5;

  public constructor(
    @Inject(ORDERS_QUERY_REPOSITORY)
    private readonly ordersQueryRepository: IOrdersQueryRepository,

    @Inject(AUDIT_LOG_QUERY_REPOSITORY)
    private readonly auditLogQueryRepository: IAuditLogQueryRepository,

    @Inject(BOOKS_QUERY_REPOSITORY)
    private readonly booksQueryRepository: IBooksQueryRepository,
  ) {}

  public async execute(): Promise<GetStaffDashboardResponse> {
    const orderWorkload = await this.getOrderWorkload();
    const todayActivity = await this.getTodayActivity();
    const stockAlerts = await this.getStockAlerts();

    return new GetStaffDashboardResponse(
      orderWorkload,
      todayActivity,
      stockAlerts,
    );
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

  private async getStockAlerts(): Promise<BookStockAlertsReadModel> {
    return this.booksQueryRepository.findStockAlerts(
      GetStaffDashboardUseCase.LOW_STOCK_THRESHOLD,
      GetStaffDashboardUseCase.LOW_STOCK_BOOK_LIMIT,
    );
  }

  private getRecentOrderPlaced() {}
}
