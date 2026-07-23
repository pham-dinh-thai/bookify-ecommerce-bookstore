export class CartItemReadModel {
  public constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly price: number,
    public readonly isActive: boolean,
    public readonly title: string,
    public readonly author: string,
    public readonly edition: string,
    public readonly cover: string,
    public readonly stock: number,
    public readonly isAvailable: boolean,
  ) {}
}
