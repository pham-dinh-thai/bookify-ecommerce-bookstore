import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemProps } from './entities/types';
import { OrderStatus } from './enums/order-status.enum';
import { PaymentMethod } from './enums/payment-method.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import { OrderIdEmptyException } from './exceptions/order-id-empty.exception';
import { OrderItemNotFoundException } from './exceptions/order-item-not-found.exception';
import { OrderStatusCanNotBeUpdatedException } from './exceptions/order-status-can-not-be-updated.exception';
import { UserIdEmptyException } from './exceptions/user-id-empty.exception';
import { CreateOrderProps, FromPersistentOrderProps } from './types';

export class Order {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private items: OrderItem[],
    private status: OrderStatus,
    private paymentStatus: PaymentStatus,
    private readonly paymentMethod: PaymentMethod,
  ) {}

  public static create(props: CreateOrderProps): Order {
    if (!props.id) {
      throw new OrderIdEmptyException();
    }

    if (!props.userId) {
      throw new UserIdEmptyException();
    }

    return new Order(
      props.id,
      props.userId,
      [],
      OrderStatus.PENDING,
      Order.getInitialPaymentStatus(props.paymentMethod),
      props.paymentMethod,
    );
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
      props.status,
      props.paymentStatus,
      props.paymentMethod,
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

  public confirm(): void {
    this.ensureStatusIs(OrderStatus.PENDING);
    this.status = OrderStatus.CONFIRMED;
  }

  public startDelivery(): void {
    this.ensureStatusIs(OrderStatus.CONFIRMED);
    this.status = OrderStatus.DELIVERING;
  }

  public markAsDelivered(): void {
    this.ensureStatusIs(OrderStatus.DELIVERING);
    this.status = OrderStatus.DELIVERED;
  }

  public complete(): void {
    this.ensureStatusIs(OrderStatus.DELIVERED);
    this.status = OrderStatus.COMPLETED;
  }

  public cancel(): void {
    this.ensureStatusIs(OrderStatus.PENDING, OrderStatus.CONFIRMED);
    this.status = OrderStatus.CANCELED;
  }

  public refund(): void {
    this.ensureStatusIs(OrderStatus.CANCELED, OrderStatus.DELIVERED);
    this.status = OrderStatus.REFUNDED;
  }

  public markAsUnpaid(): void {
    this.paymentStatus = PaymentStatus.UNPAID;
  }

  public markAsPending(): void {
    this.paymentStatus = PaymentStatus.PENDING;
  }

  public markAsPaid(): void {
    this.paymentStatus = PaymentStatus.PAID;
  }

  public markAsFailed(): void {
    this.paymentStatus = PaymentStatus.FAILED;
  }

  public markAsRefunded(): void {
    this.paymentStatus = PaymentStatus.REFUNDED;
  }

  public getTotalPrice(): number {
    let total = 0;

    for (const item of this.items) {
      total += item.getTotalPrice();
    }

    return total;
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

  public getStatus(): OrderStatus {
    return this.status;
  }

  public getPaymentStatus(): PaymentStatus {
    return this.paymentStatus;
  }

  public getPaymentMethod(): PaymentMethod {
    return this.paymentMethod;
  }

  private static getInitialPaymentStatus(
    paymentMethod: PaymentMethod,
  ): PaymentStatus {
    if (paymentMethod === PaymentMethod.CASH_ON_DELIVERY) {
      return PaymentStatus.UNPAID;
    }

    return PaymentStatus.PENDING;
  }

  private ensureStatusIs(...allowedStatuses: OrderStatus[]): void {
    if (!allowedStatuses.includes(this.status)) {
      throw new OrderStatusCanNotBeUpdatedException();
    }
  }
}
