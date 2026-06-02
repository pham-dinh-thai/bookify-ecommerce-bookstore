import { TopAuthorReadModel } from '../../../domain/admin-dashboard-aggregate/read-models/top-author.read-model';
import { TopGenreReadModel } from '../../../domain/admin-dashboard-aggregate/read-models/top-genre.read-model';

export class GetShopNavigationResponse {
  public constructor(
    public readonly topGenres: TopGenreReadModel[],
    public readonly topAuthors: TopAuthorReadModel[],
  ) {}
}
