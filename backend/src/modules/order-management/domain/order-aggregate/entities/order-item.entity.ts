import { OrderItemIdEmptyException } from './exceptions/order-item-id-empty.exception';
import { OrderItemPriceCanNotNegativeException } from './exceptions/order-item-price-can-not-negative.exception';
import { OrderItemPriceEmptyException } from './exceptions/order-item-price-empty.exception';
import { ProductIdEmptyException } from './exceptions/product-id-empty.exception';
import { CreateOrderItemProps, FromPersistentOrderItemProps } from './types';
import { OrderItemQuantity } from './value-objects/order-item-quantity.value-object';

export class OrderItem {
  private constructor(
    private readonly id: string,
    private productId: string,
    private quantity: OrderItemQuantity,
    private price: number,
  ) {}

  public static create(props: CreateOrderItemProps): OrderItem {
    if (!props.id) {
      throw new OrderItemIdEmptyException();
    }

    if (!props.productId) {
      throw new ProductIdEmptyException();
    }

    if (props.price == null) {
      throw new OrderItemPriceEmptyException();
    }

    if (props.price < 0) {
      throw new OrderItemPriceCanNotNegativeException();
    }

    return new OrderItem(
      props.id,
      props.productId,
      OrderItemQuantity.create(props.quantity),
      props.price,
    );
  }

  public static fromPersistent(props: FromPersistentOrderItemProps): OrderItem {
    return new OrderItem(
      props.id,
      props.productId,
      OrderItemQuantity.create(props.quantity),
      props.price,
    );
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
