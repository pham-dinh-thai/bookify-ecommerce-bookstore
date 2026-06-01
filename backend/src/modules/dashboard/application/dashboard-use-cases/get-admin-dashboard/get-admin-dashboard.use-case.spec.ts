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
import { IOrdersQueryRepository } from '../../../../order/domain/order-aggregate/repositories/orders-query.repository.interface';
import { TopAuthorReadModel } from '../../../domain/admin-dashboard-aggregate/read-models/top-author.read-model';
import { TopGenreReadModel } from '../../../domain/admin-dashboard-aggregate/read-models/top-genre.read-model';
import { TopLanguageReadModel } from '../../../domain/admin-dashboard-aggregate/read-models/top-language.read-model';
import { TopPublisherReadModel } from '../../../domain/admin-dashboard-aggregate/read-models/top-publisher.read-model';

describe('GetAdminDashboardUseCase', () => {
  it('returns system totals and recent activities from query repositories', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-06-01T12:00:00.000Z'));

    const recentActivities = [
      new AuditLogReadModel(
        'audit-log-id',
        'Created a book',
        'admin',
        null,
        new Date('2026-06-01T08:00:00.000Z'),
      ),
    ];
    const topGenres = [
      new TopGenreReadModel('genre-id', 'Fiction', 12, 480000),
    ];
    const topAuthors = [
      new TopAuthorReadModel('author-id', 'Franz Kafka', 9, 360000),
    ];
    const topPublishers = [
      new TopPublisherReadModel('publisher-id', 'Penguin Classics', 7, 280000),
    ];
    const topLanguages = [
      new TopLanguageReadModel('en', 'English', 16, 640000),
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
    const ordersQueryRepository = {
      findTopGenresByUnitsSold: jest.fn().mockResolvedValue(topGenres),
      findTopAuthorsByUnitsSold: jest.fn().mockResolvedValue(topAuthors),
      findTopPublishersByUnitsSold: jest.fn().mockResolvedValue(topPublishers),
      findTopLanguagesByUnitsSold: jest.fn().mockResolvedValue(topLanguages),
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
      ordersQueryRepository as unknown as IOrdersQueryRepository,
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
    expect(ordersQueryRepository.findTopGenresByUnitsSold).toHaveBeenCalledWith(
      5,
      new Date('2026-05-02T12:00:00.000Z'),
    );
    expect(
      ordersQueryRepository.findTopAuthorsByUnitsSold,
    ).toHaveBeenCalledWith(5, new Date('2026-05-02T12:00:00.000Z'));
    expect(
      ordersQueryRepository.findTopPublishersByUnitsSold,
    ).toHaveBeenCalledWith(5, new Date('2026-05-02T12:00:00.000Z'));
    expect(
      ordersQueryRepository.findTopLanguagesByUnitsSold,
    ).toHaveBeenCalledWith(5, new Date('2026-05-02T12:00:00.000Z'));
    expect(response.topGenres).toBe(topGenres);
    expect(response.topAuthors).toBe(topAuthors);
    expect(response.topPublishers).toBe(topPublishers);
    expect(response.topLanguages).toBe(topLanguages);

    jest.useRealTimers();
  });
});
