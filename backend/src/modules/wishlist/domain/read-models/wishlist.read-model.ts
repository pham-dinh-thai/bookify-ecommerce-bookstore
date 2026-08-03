import { WishlistItemReadModel } from './wishlist-item.read-model';

export class WishlistReadModel {
  public constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: WishlistItemReadModel[],
  ) {}
}
