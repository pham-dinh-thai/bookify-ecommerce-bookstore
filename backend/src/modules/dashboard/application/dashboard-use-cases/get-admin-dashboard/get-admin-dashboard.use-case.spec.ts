import { GetAdminDashboardUseCase } from './get-admin-dashboard.use-case';
import { IUsersQueryRepository } from '../../../../user-management/domain/user-aggregate/repositories/users-query.repository.interface';
import { ICustomersQueryRepository } from '../../../../customer-management/domain/customer-aggregate/repositories/customers-query.repository.interface';
import { IGenresQueryRepository } from '../../../../catalog-management/domain/genre-aggregate/repositories/genres-query.repository.interface';
import { IPublishersQueryRepository } from '../../../../catalog-management/domain/publisher-aggregate/repositories/publishers-query.repository.interface';
import { IAuthorsQueryRepository } from '../../../../catalog-management/domain/author-aggregate/repositories/authors-query.repository.interface';
import { ILanguagesQueryRepository } from '../../../../catalog-management/domain/language-aggregate/repositories/languages-query.repository.interface';
import { IBooksQueryRepository } from '../../../../book-management/domain/book-aggregate/repositories/books-query.repository.interface';
import { IAuditLogQueryRepository } from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-query.repositoy.interface';
import { AuditLogReadModel } from '../../../../audit-log/domain/audit-log-aggregate/read-models/audit-log.read-model';

describe('GetAdminDashboardUseCase', () => {
  it('returns system totals and recent activities from query repositories', async () => {
    const recentActivities = [
      new AuditLogReadModel(
        'audit-log-id',
        'Created a book',
        'admin',
        null,
        new Date('2026-06-01T08:00:00.000Z'),
      ),
    ];
    const usersQueryRepository = {
      countByRole: jest.fn().mockResolvedValue(1),
    };
    const customersQueryRepository = { count: jest.fn().mockResolvedValue(2) };
    const genresQueryRepository = { count: jest.fn().mockResolvedValue(3) };
    const publishersQueryRepository = { count: jest.fn().mockResolvedValue(4) };
    const authorsQueryRepository = { count: jest.fn().mockResolvedValue(5) };
    const languagesQueryRepository = { count: jest.fn().mockResolvedValue(6) };
    const booksQueryRepository = { count: jest.fn().mockResolvedValue(7) };
    const auditLogQueryRepository = {
      count: jest.fn().mockResolvedValue(8),
      recentActivity: jest.fn().mockResolvedValue(recentActivities),
    };

    const useCase = new GetAdminDashboardUseCase(
      usersQueryRepository as unknown as IUsersQueryRepository,
      customersQueryRepository as unknown as ICustomersQueryRepository,
      genresQueryRepository as unknown as IGenresQueryRepository,
      publishersQueryRepository as unknown as IPublishersQueryRepository,
      authorsQueryRepository as unknown as IAuthorsQueryRepository,
      languagesQueryRepository as unknown as ILanguagesQueryRepository,
      booksQueryRepository as unknown as IBooksQueryRepository,
      auditLogQueryRepository as unknown as IAuditLogQueryRepository,
    );

    const response = await useCase.execute();

    expect(usersQueryRepository.countByRole).toHaveBeenCalledWith('staff');
    expect(response.systemTotals).toEqual({
      totalStaff: 1,
      totalCustomers: 2,
      totalGenres: 3,
      totalPublishers: 4,
      totalAuthors: 5,
      totalLanguages: 6,
      totalBooks: 7,
      totalAuditLogs: 8,
    });
    expect(response.recentActivities).toBe(recentActivities);
  });
});
