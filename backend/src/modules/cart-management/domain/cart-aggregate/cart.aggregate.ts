import { CartItem } from './entities/cart-item.entity';
import { CartItemDuplicatedException } from './entities/exceptions/cart-item-duplicated.exception';
import { CartItemLimitExceededException } from './entities/exceptions/cart-item-limit-exceeded.exception';
import { CartItemNotFoundException } from './entities/exceptions/cart-item-not-found.exception';
import { CreateCartItemProps } from './entities/types';
import { CreateCartProps, FromPersistentCartProps } from './types';

export class Cart {
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

  public addItem(item: CreateCartItemProps): void {
    const existing = this.items.find(
      (fromCart) => fromCart.getId() === item.id,
    );

    if (existing) {
      throw new CartItemDuplicatedException();
    }

    if (this.items.length >= Cart.MAX_ITEMS) {
      throw new CartItemLimitExceededException();
    }

    this.items.push(CartItem.create(item));
  }

  public removeItem(itemId: string): void {
    const index = this.items.findIndex((item) => item.getId() === itemId);
    if (index === -1) {
      throw new CartItemNotFoundException();
    }

    this.items.splice(index, 1);
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
