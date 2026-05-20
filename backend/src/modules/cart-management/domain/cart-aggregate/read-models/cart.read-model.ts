import { CartItemReadModel } from '../entities/read-models/cart-item.read-model';

export class CartReadModel {
  public constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: CartItemReadModel[],
  ) {}
}
