export class TopPublisherReadModel {
  public constructor(
    public readonly publisherId: string,
    public readonly publisherName: string,
    public readonly unitsSold: number,
    public readonly revenue: number,
  ) {}
}
