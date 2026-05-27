import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemProps } from './entities/types';
import { OrderIdEmptyException } from './exceptions/order-id-empty.exception';
import { OrderItemNotFoundException } from './exceptions/order-item-not-found.exception';
import { UserIdEmptyException } from './exceptions/user-id-empty.exception';
import { CreateOrderProps, FromPersistentOrderProps } from './types';

export class Order {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly items: OrderItem[],
  ) {}

  public static create(props: CreateOrderProps): Order {
    if (!props.id) {
      throw new OrderIdEmptyException();
    }

    if (!props.userId) {
      throw new UserIdEmptyException();
    }

    return new Order(props.id, props.userId, []);
  }

  public static fromPersistent(props: FromPersistentOrderProps): Order {
    return new Order(
      props.id,
      props.userId,
      props.items.map((item) =>
        OrderItem.fromPersistent({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        }),
      ),
    );
  }

  public addItem(item: CreateOrderItemProps): OrderItem {
    const addedItem = OrderItem.create(item);

    this.items.push(addedItem);

    return addedItem;
  }

  public removeItem(itemId: string): { deletedId: string } {
    const index = this.items.findIndex((item) => item.getId() === itemId);
    if (index === -1) {
      throw new OrderItemNotFoundException();
    }

    this.items.splice(index, 1);

    return { deletedId: itemId };
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getItems(): OrderItem[] {
    return [...this.items];
  }

  public getTotalPrice(): number {
    let total = 0;

    for (const item of this.items) {
      total += item.getTotalPrice();
    }

    return total;
  }
}
