export class CartItemReadModel {
  public constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly price: number,
    public readonly isActive: boolean,
  ) {}
}
