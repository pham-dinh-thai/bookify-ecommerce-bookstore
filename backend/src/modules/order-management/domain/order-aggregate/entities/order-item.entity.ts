import { CreateOrderItemProps } from './types';
import { OrderItemQuantity } from './value-objects/order-item-quantity.value-object';

export class OrderItem {
  private constructor(
    private readonly id: string,
    private productId: string,
    private quantity: OrderItemQuantity,
    private price: number,
  ) {}

  public static create(props: CreateOrderItemProps): OrderItem {
    return new OrderItem(
      props.id,
      props.productId,
      OrderItemQuantity.create(props.quantity),
      props.price,
    );
  }

  public updateQuantity(quantity: number): void {
    this.quantity = this.quantity.update(quantity);
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

  public getTotalPrice(): number {
    return this.quantity.getValue() * this.price;
  }
}
