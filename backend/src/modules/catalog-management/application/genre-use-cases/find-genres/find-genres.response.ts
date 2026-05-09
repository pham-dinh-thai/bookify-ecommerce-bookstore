import { GenreReadModel } from '../../../domain/genre-aggregate/read-models/genre.read-model';

export class FindGenresResponse {
  public constructor(
    public readonly genres: GenreReadModel[],
    public readonly total: number,
  ) {}
}
