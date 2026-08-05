export class BookReadModel {
  public constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly publisher: string,
    public readonly authors: string[],
    public readonly originalPrice: number,
    public readonly discountPercentage: number,
    public readonly currentPrice: number,
    public readonly isOnSale: boolean,
    public readonly quantity: number,
    public readonly isInStock: boolean,
    public readonly genres: string[],
    public readonly covers?: {
      url: string;
      isPrimary: boolean;
    }[],
  ) {}
}
