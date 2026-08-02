import {
  CreateWishlistItemProps,
  FromPersistentWishlistItemProps,
} from '../types';

export class WishlistItem {
  public constructor(
    private readonly id: string,
    private itemId: string,
  ) {}

  public static create(props: CreateWishlistItemProps): WishlistItem {
    return new WishlistItem(props.id, props.itemId);
  }

  public static fromPersistent(
    props: FromPersistentWishlistItemProps,
  ): WishlistItem {
    return new WishlistItem(props.id, props.itemId);
  }

  public getId(): string {
    return this.id;
  }

  public getItemId(): string {
    return this.itemId;
  }
}
