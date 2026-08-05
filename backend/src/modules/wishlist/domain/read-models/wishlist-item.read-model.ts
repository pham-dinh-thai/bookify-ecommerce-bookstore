export class WishlistItemReadModel {
  public constructor(
    public readonly id: string,
    public readonly itemId: string,
    public readonly title: string,
    public readonly author: string,
    public readonly cover: string,
    public readonly originalPrice: number,
    public readonly currentPrice: number,
    public readonly discountPercentage: number,
    public readonly isAvailable: boolean,
    public readonly genreIds: string[] = [],
  ) {}
}
