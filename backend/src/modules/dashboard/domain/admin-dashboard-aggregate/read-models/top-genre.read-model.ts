export class TopGenreReadModel {
  public constructor(
    public readonly genreId: string,
    public readonly genreName: string,
    public readonly unitsSold: number,
    public readonly revenue: number,
  ) {}
}
