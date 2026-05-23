import { CartItem } from './entities/cart-item.entity';
import { CartItemDuplicatedException } from './exceptions/cart-item-duplicated.exception';
import { CartItemLimitExceededException } from './exceptions/cart-item-limit-exceeded.exception';
import { CartItemNotFoundException } from './exceptions/cart-item-not-found.exception';
import { CreateCartItemProps } from './entities/types';
import { CreateCartProps, FromPersistentCartProps } from './types';

/**
 * Cart aggregate root.
 *
 * Rules:
 * - Each item can only appear once in the cart
 * - Number of items cannot exceed MAX_ITEMS
 * - Cannot remove an item that does not exist in the cart
 */
export class Cart {
  /** Maximum number of items allowed in a single cart */
  private static MAX_ITEMS = 100;

  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private items: CartItem[],
  ) {}

  public static create(props: CreateCartProps): Cart {
    return new Cart(props.id, props.userId, []);
  }

  public static fromPersistent(props: FromPersistentCartProps): Cart {
    return new Cart(
      props.id,
      props.userId,
      props.items.map((item) => CartItem.fromPersistent(item)),
    );
  }

  public addItem(item: CreateCartItemProps): CartItem {
    const existing = this.items.find(
      (fromCart) => fromCart.getId() === item.id,
    );

    if (existing) {
      throw new CartItemDuplicatedException();
    }

    if (this.items.length >= Cart.MAX_ITEMS) {
      throw new CartItemLimitExceededException();
    }

    const addedItem = CartItem.create(item);

    this.items.push(addedItem);

    return addedItem;
  }

  public removeItem(itemId: string): { deletedId: string } {
    const index = this.items.findIndex((item) => item.getId() === itemId);
    if (index === -1) {
      throw new CartItemNotFoundException();
    }

    this.items.splice(index, 1);

    return { deletedId: itemId };
  }

  public hasDisableItem(): boolean {
    return this.items.some((item) => !item.isActive);
  }

  public getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.getTotalPrice(), 0);
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getItems(): CartItem[] {
    return [...this.items];
  }
}
