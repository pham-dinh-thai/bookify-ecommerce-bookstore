export class OrderDetailItemReadModel {
  public constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly title: string,
    public readonly imageUrl: string | null,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly lineTotal: number,
  ) {}
}
