import { AuditLogReadModel } from '../../../../audit-log/domain/audit-log-aggregate/read-models/audit-log.read-model';
import { SystemTotalsReadModel } from '../../../domain/admin-dashboard-aggregate/read-models/system-totals.read-model';
import { TopAuthorReadModel } from '../../../domain/admin-dashboard-aggregate/read-models/top-author.read-model';
import { TopGenreReadModel } from '../../../domain/admin-dashboard-aggregate/read-models/top-genre.read-model';
import { TopLanguageReadModel } from '../../../domain/admin-dashboard-aggregate/read-models/top-language.read-model';
import { TopPublisherReadModel } from '../../../domain/admin-dashboard-aggregate/read-models/top-publisher.read-model';

export class GetAdminDashboardResponse {
  public constructor(
    public readonly systemTotals: SystemTotalsReadModel,
    public readonly recentActivities: AuditLogReadModel[],
    public readonly topGenres: TopGenreReadModel[],
    public readonly topAuthors: TopAuthorReadModel[],
    public readonly topPublishers: TopPublisherReadModel[],
    public readonly topLanguages: TopLanguageReadModel[],
  ) {}
}
