import { OrderItemQuantityCanNotBeLessThanOneException } from '../exceptions/order-item-quantity-can-not-be-less-than-one.exception';

export class OrderItemQuantity {
  private constructor(private readonly value: number) {
    if (!this.value || this.value <= 0) {
      throw new OrderItemQuantityCanNotBeLessThanOneException();
    }
  }

  public static create(quantity: number): OrderItemQuantity {
    return new OrderItemQuantity(quantity);
  }

  public getValue(): number {
    return this.value;
  }
}
