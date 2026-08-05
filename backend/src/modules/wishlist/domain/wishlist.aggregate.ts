import { WishlistItem } from './entities/wishlist-item.entity';
import {
  CreateWishlistItemProps,
  CreateWishlistProps,
  FromPersistentWishlistProps,
} from './types';

export class Wishlist {
  public constructor(
    private readonly id: string,
    private readonly userId: string,
    private items: WishlistItem[],
  ) {}

  public static create(props: CreateWishlistProps): Wishlist {
    return new Wishlist(props.id, props.userId, []);
  }

  public static fromPersistent(props: FromPersistentWishlistProps): Wishlist {
    return new Wishlist(props.id, props.userId, props.items);
  }

  public addItem(props: CreateWishlistItemProps): WishlistItem {
    const existingItem = this.items.find(
      (item) => item.getItemId() === props.itemId,
    );

    if (existingItem) {
      return existingItem;
    }

    const item = WishlistItem.create(props);

    this.items.push(item);

    return item;
  }

  public hasItem(itemId: string): boolean {
    return this.items.some((item) => item.getItemId() === itemId);
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getItems(): WishlistItem[] {
    return [...this.items];
  }
}
