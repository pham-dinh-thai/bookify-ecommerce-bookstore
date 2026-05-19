import { CartItemIdEmptyException } from './exceptions/cart-item-id-empty.exception';
import { ProductIdEmptyException } from './exceptions/product-id-empty.exception';
import { ProductQuantityCanNotBeLessThanOneException } from './exceptions/product-quantity-can-not-be-less-than-one.exception';
import { CreateCartProps } from './types';

export class CartItem {
  private constructor(
    private readonly id: string,
    private productId: string,
    private quantity: number,
    private price: number,
  ) {}

  public static create(props: CreateCartProps): CartItem {
    if (!props.id) {
      throw new CartItemIdEmptyException();
    }

    if (!props.productId) {
      throw new ProductIdEmptyException();
    }

    if (!props.quantity || props.quantity <= 0) {
      throw new ProductQuantityCanNotBeLessThanOneException();
    }

    return new CartItem(props.id, props.productId, props.quantity, props.price);
  }
}
