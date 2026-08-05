import { GetStaffDashboardUseCase } from './get-staff-dashboard.use-case';
import { BookStockAlertsReadModel } from '../../../../book-management/domain/read-models/book-stock-alerts.read-model';
import { IBooksQueryRepository } from '../../../../book-management/domain/repositories/books-query.repository.interface';
import { IOrdersQueryRepository } from '../../../../order/domain/order-aggregate/repositories/orders-query.repository.interface';
import { IAuditLogQueryRepository } from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-query.repositoy.interface';
import { OrderReadModel } from '../../../../order/domain/order-aggregate/read-models/order.read-model';
import { OrderStatus } from '../../../../order/domain/order-aggregate/enums/order-status.enum';
import { PaymentStatus } from '../../../../order/domain/order-aggregate/enums/payment-status.enum';
import { PaymentMethod } from '../../../../order/domain/order-aggregate/enums/payment-method.enum';

describe('GetStaffDashboardUseCase', () => {
  it('returns the staff operations dashboard contract', async () => {
    const createdAt = new Date('2026-06-01T08:00:00.000Z');
    const ordersQueryRepository = {
      countWorkload: jest.fn().mockResolvedValue({
        pending: 1,
        confirmed: 2,
        delivering: 3,
        unpaidCod: 4,
        deliveredUnpaid: 5,
      }),
      findRecent: jest
        .fn()
        .mockResolvedValue([
          new OrderReadModel(
            'order-id',
            'ORD-001',
            OrderStatus.PENDING,
            PaymentStatus.UNPAID,
            PaymentMethod.CASH_ON_DELIVERY,
            125000,
            2,
            createdAt,
          ),
        ]),
    };
    const auditLogQueryRepository = {
      countTodayOrderActivity: jest.fn().mockResolvedValue({
        placed: 6,
        confirmed: 7,
        delivered: 8,
        completed: 9,
        canceled: 10,
      }),
    };
    const stockAlerts = new BookStockAlertsReadModel(1, 3, 5, [
      {
        id: 'book-id',
        isbn: '9780000000000',
        title: 'Low Stock Book',
        quantity: 2,
      },
    ]);
    const booksQueryRepository = {
      findStockAlerts: jest.fn().mockResolvedValue(stockAlerts),
    };

    const useCase = new GetStaffDashboardUseCase(
      ordersQueryRepository as unknown as IOrdersQueryRepository,
      auditLogQueryRepository as unknown as IAuditLogQueryRepository,
      booksQueryRepository as unknown as IBooksQueryRepository,
    );

    const response = await useCase.execute();

    expect(booksQueryRepository.findStockAlerts).toHaveBeenCalledWith(5, 5);
    expect(ordersQueryRepository.findRecent).toHaveBeenCalledWith(5);
    expect(response.stockAlerts).toBe(stockAlerts);
    expect(response.recentOrders).toEqual([
      {
        id: 'order-id',
        orderCode: 'ORD-001',
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
        totalAmount: 125000,
        createdAt,
        detailPath: '/staff/orders/order-id',
      },
    ]);
    expect(response.quickActions).toEqual([
      {
        key: 'order-management',
        label: 'Order Management',
        path: '/staff/orders',
      },
      {
        key: 'import-stock',
        label: 'Import Stock',
        path: '/staff/stock',
      },
      {
        key: 'book-management',
        label: 'Book Management',
        path: '/staff/books',
      },
      {
        key: 'customer-directory',
        label: 'Customer Directory',
        path: '/staff/customers',
      },
    ]);
  });
});
