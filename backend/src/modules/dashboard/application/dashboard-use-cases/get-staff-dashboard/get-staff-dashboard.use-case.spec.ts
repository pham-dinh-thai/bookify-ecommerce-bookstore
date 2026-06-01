import { GetStaffDashboardUseCase } from './get-staff-dashboard.use-case';
import { BookStockAlertsReadModel } from '../../../../book-management/domain/book-aggregate/read-models/book-stock-alerts.read-model';
import { IBooksQueryRepository } from '../../../../book-management/domain/book-aggregate/repositories/books-query.repository.interface';
import { IOrdersQueryRepository } from '../../../../order/domain/order-aggregate/repositories/orders-query.repository.interface';
import { IAuditLogQueryRepository } from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-query.repositoy.interface';

describe('GetStaffDashboardUseCase', () => {
  it('returns stock alerts with low-stock threshold and quick action list', async () => {
    const ordersQueryRepository = {
      countWorkload: jest.fn().mockResolvedValue({
        pending: 1,
        confirmed: 2,
        delivering: 3,
        unpaidCod: 4,
        deliveredUnpaid: 5,
      }),
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
    expect(response.stockAlerts).toBe(stockAlerts);
  });
});
