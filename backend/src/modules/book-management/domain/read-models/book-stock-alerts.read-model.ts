export class LowStockBookReadModel {
  public constructor(
    public readonly id: string,
    public readonly isbn: string,
    public readonly title: string,
    public readonly quantity: number,
  ) {}
}

export class BookStockAlertsReadModel {
  public constructor(
    public readonly outOfStockCount: number,
    public readonly lowStockCount: number,
    public readonly lowStockThreshold: number,
    public readonly lowStockBooks: LowStockBookReadModel[],
  ) {}
}
