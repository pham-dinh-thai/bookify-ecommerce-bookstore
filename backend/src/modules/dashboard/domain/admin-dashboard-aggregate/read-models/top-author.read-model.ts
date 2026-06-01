export class TopAuthorReadModel {
  public constructor(
    public readonly authorId: string,
    public readonly authorName: string,
    public readonly unitsSold: number,
    public readonly revenue: number,
  ) {}
}
