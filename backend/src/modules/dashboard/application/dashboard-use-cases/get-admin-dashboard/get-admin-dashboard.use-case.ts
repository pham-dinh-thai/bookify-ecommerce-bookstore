import { Inject, Injectable } from '@nestjs/common';
import {
  type IUsersQueryRepository,
  USERS_QUERY_REPOSITORY,
} from '../../../../user-management/domain/user-aggregate/repositories/users-query.repository.interface';
import {
  CUSTOMERS_QUERY_REPOSITORY,
  type ICustomersQueryRepository,
} from '../../../../customer-management/domain/customer-aggregate/repositories/customers-query.repository.interface';
import {
  GENRES_QUERY_REPOSITORY,
  type IGenresQueryRepository,
} from '../../../../catalog-management/domain/genre-aggregate/repositories/genres-query.repository.interface';
import {
  PUBLISHERS_QUERY_REPOSITORY,
  type IPublishersQueryRepository,
} from '../../../../catalog-management/domain/publisher-aggregate/repositories/publishers-query.repository.interface';
import {
  AUTHORS_QUERY_REPOSITORY,
  type IAuthorsQueryRepository,
} from '../../../../catalog-management/domain/author-aggregate/repositories/authors-query.repository.interface';
import {
  LANGUAGES_QUERY_REPOSITORY,
  type ILanguagesQueryRepository,
} from '../../../../catalog-management/domain/language-aggregate/repositories/languages-query.repository.interface';
import {
  BOOKS_QUERY_REPOSITORY,
  type IBooksQueryRepository,
} from '../../../../book-management/domain/repositories/books-query.repository.interface';
import {
  AUDIT_LOG_QUERY_REPOSITORY,
  type IAuditLogQueryRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-query.repositoy.interface';
import {
  ORDERS_QUERY_REPOSITORY,
  type IOrdersQueryRepository,
} from '../../../../order/domain/order-aggregate/repositories/orders-query.repository.interface';
import { SystemTotalsReadModel } from '../../../domain/admin-dashboard-aggregate/read-models/system-totals.read-model';
import { GetAdminDashboardResponse } from './get-admin-dashboard.response';

@Injectable()
export class GetAdminDashboardUseCase {
  private static readonly TOP_GENRE_LIMIT = 5;
  private static readonly TOP_AUTHOR_LIMIT = 5;
  private static readonly TOP_PUBLISHER_LIMIT = 5;
  private static readonly TOP_LANGUAGE_LIMIT = 5;
  private static readonly SALES_LOOKBACK_DAYS = 30;

  public constructor(
    @Inject(USERS_QUERY_REPOSITORY)
    private readonly usersQueryRepository: IUsersQueryRepository,

    @Inject(CUSTOMERS_QUERY_REPOSITORY)
    private readonly customersQueryRepository: ICustomersQueryRepository,

    @Inject(GENRES_QUERY_REPOSITORY)
    private readonly genresQueryRepository: IGenresQueryRepository,

    @Inject(PUBLISHERS_QUERY_REPOSITORY)
    private readonly publishersQueryRepository: IPublishersQueryRepository,

    @Inject(AUTHORS_QUERY_REPOSITORY)
    private readonly authorsQueryRepository: IAuthorsQueryRepository,

    @Inject(LANGUAGES_QUERY_REPOSITORY)
    private readonly languagesQueryRepository: ILanguagesQueryRepository,

    @Inject(BOOKS_QUERY_REPOSITORY)
    private readonly booksQueryRepository: IBooksQueryRepository,

    @Inject(AUDIT_LOG_QUERY_REPOSITORY)
    private readonly auditLogQueryRepository: IAuditLogQueryRepository,

    @Inject(ORDERS_QUERY_REPOSITORY)
    private readonly ordersQueryRepository: IOrdersQueryRepository,
  ) {}

  public async execute(): Promise<GetAdminDashboardResponse> {
    const salesSince = this.getSalesSinceDate();
    const [
      totalStaff,
      totalCustomers,
      totalGenres,
      totalPublishers,
      totalAuthors,
      totalLanguages,
      totalBooks,
      totalAuditLogs,
      recentActivities,
      topGenres,
      topAuthors,
      topPublishers,
      topLanguages,
    ] = await Promise.all([
      this.usersQueryRepository.countByRole('staff'),
      this.customersQueryRepository.count(),
      this.genresQueryRepository.count(),
      this.publishersQueryRepository.count(),
      this.authorsQueryRepository.count(),
      this.languagesQueryRepository.count(),
      this.booksQueryRepository.count(),
      this.auditLogQueryRepository.count(),
      this.auditLogQueryRepository.recentActivity(),
      this.ordersQueryRepository.findTopGenresByUnitsSold(
        GetAdminDashboardUseCase.TOP_GENRE_LIMIT,
        salesSince,
      ),
      this.ordersQueryRepository.findTopAuthorsByUnitsSold(
        GetAdminDashboardUseCase.TOP_AUTHOR_LIMIT,
        salesSince,
      ),
      this.ordersQueryRepository.findTopPublishersByUnitsSold(
        GetAdminDashboardUseCase.TOP_PUBLISHER_LIMIT,
        salesSince,
      ),
      this.ordersQueryRepository.findTopLanguagesByUnitsSold(
        GetAdminDashboardUseCase.TOP_LANGUAGE_LIMIT,
        salesSince,
      ),
    ]);

    return new GetAdminDashboardResponse(
      new SystemTotalsReadModel(
        totalStaff,
        totalCustomers,
        totalGenres,
        totalPublishers,
        totalAuthors,
        totalLanguages,
        totalBooks,
        totalAuditLogs,
      ),
      recentActivities,
      topGenres,
      topAuthors,
      topPublishers,
      topLanguages,
    );
  }

  private getSalesSinceDate(): Date {
    const since = new Date();
    since.setDate(
      since.getDate() - GetAdminDashboardUseCase.SALES_LOOKBACK_DAYS,
    );

    return since;
  }
}
