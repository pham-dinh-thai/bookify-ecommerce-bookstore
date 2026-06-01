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
import { RecentOrderReadModel } from '../../../domain/staff-dashboard-aggregate/read-models/recent-order.read-model';
import { QuickActionReadModel } from '../../../domain/staff-dashboard-aggregate/read-models/quick-action.read-model';

@Injectable()
export class GetStaffDashboardUseCase {
  private static readonly LOW_STOCK_THRESHOLD = 5;
  private static readonly LOW_STOCK_BOOK_LIMIT = 5;
  private static readonly RECENT_ORDER_LIMIT = 5;

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
    const recentOrders = await this.getRecentOrders();
    const quickActions = this.getQuickActions();

    return new GetStaffDashboardResponse(
      orderWorkload,
      todayActivity,
      stockAlerts,
      recentOrders,
      quickActions,
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

  private async getRecentOrders(): Promise<RecentOrderReadModel[]> {
    const orders = await this.ordersQueryRepository.findRecent(
      GetStaffDashboardUseCase.RECENT_ORDER_LIMIT,
    );

    return orders.map(
      (order) =>
        new RecentOrderReadModel(
          order.id,
          order.orderCode,
          order.status,
          order.paymentStatus,
          order.totalAmount,
          order.createdAt,
          `/staff/orders/${order.id}`,
        ),
    );
  }

  private getQuickActions(): QuickActionReadModel[] {
    return [
      new QuickActionReadModel(
        'order-management',
        'Order Management',
        '/staff/orders',
      ),
      new QuickActionReadModel('import-stock', 'Import Stock', '/staff/stock'),
      new QuickActionReadModel(
        'book-management',
        'Book Management',
        '/staff/books',
      ),
      new QuickActionReadModel(
        'customer-directory',
        'Customer Directory',
        '/staff/customers',
      ),
    ];
  }
}
