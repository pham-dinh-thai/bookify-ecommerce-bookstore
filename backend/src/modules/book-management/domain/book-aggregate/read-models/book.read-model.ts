export class BookReadModel {
  public constructor(
    public readonly id: string,
    public readonly isbn: string,
    public readonly title: string,
    public readonly description: string,
    public readonly originalPrice: number,
    public readonly discountPercentage: number,
    public readonly quantity: number,
    public readonly pageCount: number,
    public readonly isInStock: boolean,
    public readonly language: string,
    public readonly publisher: string,
    public readonly authors: string[],
    public readonly genres: string[],
    public readonly covers?: {
      id: string;
      url: string;
      isPrimary: boolean;
      displayOrder: number;
    }[],
  ) {}
}
