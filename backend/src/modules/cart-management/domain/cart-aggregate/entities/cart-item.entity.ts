import { CartItemIdEmptyException } from './exceptions/cart-item-id-empty.exception';
import { ProductIdEmptyException } from './exceptions/product-id-empty.exception';
import { ProductPriceCanNotNegativeException } from './exceptions/product-price-can-not-be-lnegative.exception';
import { ProductPriceEmptyException } from './exceptions/product-price-empty.exception';
import { CreateCartItemProps, FromPersistentCartItemProps } from './types';
import { ProductQuantity } from './value-objects/product-quantity.value-object';

/**
 * CartItem entity representing a single product entry in a cart.
 *
 * Rules:
 * - ID and product ID cannot be empty
 * - Price cannot be null or negative
 * - Items are active by default upon creation
 */
export class CartItem {
  private static CART_ITEM_STATUS = {
    ACTIVE: true,
    DISABLE: false,
  };

  private constructor(
    private readonly id: string,
    private readonly productId: string,
    private quantity: ProductQuantity,
    private price: number,
    private status: boolean = CartItem.CART_ITEM_STATUS.ACTIVE,
  ) {}

  public static create(props: CreateCartItemProps): CartItem {
    if (!props.id) {
      throw new CartItemIdEmptyException();
    }

    if (!props.productId) {
      throw new ProductIdEmptyException();
    }

    if (props.price == null) {
      throw new ProductPriceEmptyException();
    }

    if (props.price < 0) {
      throw new ProductPriceCanNotNegativeException();
    }

    return new CartItem(
      props.id,
      props.productId,
      ProductQuantity.create(props.quantity),
      props.price,
    );
  }

  public static fromPersistent(props: FromPersistentCartItemProps): CartItem {
    return new CartItem(
      props.id,
      props.productId,
      ProductQuantity.create(props.quantity),
      props.price,
      props.status,
    );
  }

  public updateQuantity(quantity: number): void {
    this.quantity = this.quantity.update(quantity);
  }

  public deactivate(): void {
    this.status = false;
  }

  public activate(): void {
    this.status = true;
  }

  public isActive(): boolean {
    return this.status;
  }

  public getTotalPrice(): number {
    return this.quantity.getValue() * this.price;
  }

  public getId(): string {
    return this.id;
  }

  public getProductId(): string {
    return this.productId;
  }

  public getQuantity(): number {
    return this.quantity.getValue();
  }

  public getPrice(): number {
    return this.price;
  }
}
