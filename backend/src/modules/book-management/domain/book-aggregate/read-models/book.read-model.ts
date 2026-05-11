export class BookReadModel {
  public constructor(
    public readonly id: string,
    public readonly isbn: string,
    public readonly title: string,
    public readonly authorIds: string[],
    public readonly publisherId: string,
    public readonly genreIds: string[],
    public readonly description: string,
    public readonly originalPrice: number,
    public readonly quantity: number,
    public readonly coverImageUrl: string[],
    public readonly isActive: boolean,
  ) {}
}
