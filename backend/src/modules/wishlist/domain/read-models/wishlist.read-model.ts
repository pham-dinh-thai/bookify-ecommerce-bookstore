import { WishlistItemReadModel } from './wishlist-item.read-model';

export class WishlistReadModel {
  public constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: WishlistItemReadModel[],
  ) {}

  public get bookIds(): string[] {
    return this.items.map((item) => item.itemId);
  }

  public get genreIds(): string[] {
    return [...new Set(this.items.flatMap((item) => item.genreIds))];
  }
}
