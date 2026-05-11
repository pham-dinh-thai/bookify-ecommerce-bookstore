export class BookReadModel {
  public constructor(
    public readonly id: string,
    public readonly isbn: string,
    public readonly title: string,
    public readonly description: string,
    public readonly originalPrice: number,
    public readonly quantity: number,
    public readonly languageId: string,
    public readonly pageCount: number,
  ) {}
}
