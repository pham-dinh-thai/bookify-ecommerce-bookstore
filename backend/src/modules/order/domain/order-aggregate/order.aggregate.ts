import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemProps } from './entities/types';
import { OrderStatus } from './enums/order-status.enum';
import { PaymentMethod } from './enums/payment-method.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import { OrderIdEmptyException } from './exceptions/order-id-empty.exception';
import { OrderItemNotFoundException } from './exceptions/order-item-not-found.exception';
import { OrderPaymentNeedsToBePaidException } from './exceptions/order-payment-needs-to-be-paid.exception';
import { OrderStatusCanNotBeUpdatedException } from './exceptions/order-status-can-not-be-updated.exception';
import { UserIdEmptyException } from './exceptions/user-id-empty.exception';
import { CreateOrderProps, FromPersistentOrderProps } from './types';

/**
 * Order aggregate root.
 *
 * Business rules:
 * - An order belongs to exactly one user account
 * - New orders always start with PENDING status
 * - Cash on delivery orders start as UNPAID; online payment orders start as PENDING
 * - Order status can only move through the allowed lifecycle transitions
 * - Delivered orders can only be completed after payment is marked as paid
 * - Canceled and delivered orders can be refunded
 * - Order total is calculated from the current order items
 */
export class Order {
  private constructor(
    private readonly id: string,
    private readonly orderCode: string,
    private readonly userId: string,
    private items: OrderItem[],
    private status: OrderStatus,
    private paymentStatus: PaymentStatus,
    private readonly paymentMethod: PaymentMethod,
    private readonly shippingAddress: string,
    private readonly phoneNumber: string,
  ) {}

  /**
   * Creates a new order shell with no items yet and initializes lifecycle state
   * from the selected payment method.
   */
  public static create(props: CreateOrderProps): Order {
    if (!props.id) {
      throw new OrderIdEmptyException();
    }

    if (!props.userId) {
      throw new UserIdEmptyException();
    }

    return new Order(
      props.id,
      props.orderCode,
      props.userId,
      [],
      OrderStatus.PENDING,
      Order.getInitialPaymentStatus(props.paymentMethod),
      props.paymentMethod,
      props.shippingAddress,
      props.phoneNumber,
    );
  }

  /**
   * Reconstructs an order with its persisted items and saved lifecycle state.
   */
  public static fromPersistent(props: FromPersistentOrderProps): Order {
    return new Order(
      props.id,
      props.orderCode,
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
      props.shippingAddress,
      props.phoneNumber,
    );
  }

  /**
   * Adds a purchased product snapshot to the order.
   */
  public addItem(item: CreateOrderItemProps): OrderItem {
    const addedItem = OrderItem.create(item);

    this.items.push(addedItem);

    return addedItem;
  }

  /**
   * Removes an item from the order by ID. Throws when the item does not exist.
   */
  public removeItem(itemId: string): { deletedId: string } {
    const index = this.items.findIndex((item) => item.getId() === itemId);
    if (index === -1) {
      throw new OrderItemNotFoundException();
    }

    this.items.splice(index, 1);

    return { deletedId: itemId };
  }

  /**
   * Confirms a pending order so staff can start fulfillment.
   */
  public confirm(): void {
    this.ensureStatusIs(OrderStatus.PENDING);
    this.status = OrderStatus.CONFIRMED;
  }

  /**
   * Moves a confirmed order into delivery.
   */
  public startDelivery(): void {
    this.ensureStatusIs(OrderStatus.CONFIRMED);
    this.status = OrderStatus.DELIVERING;
  }

  /**
   * Marks an in-transit order as delivered to the customer.
   */
  public markAsDelivered(): void {
    this.ensureStatusIs(OrderStatus.DELIVERING);
    this.status = OrderStatus.DELIVERED;
  }

  /**
   * Completes a delivered order after all post-delivery work is finished.
   */
  public complete(): void {
    this.ensureStatusIs(OrderStatus.DELIVERED);
    this.ensurePaymentIsPaid();
    this.status = OrderStatus.COMPLETED;
  }

  /**
   * Cancels an order that has not entered delivery yet.
   */
  public cancel(): void {
    this.ensureStatusIs(OrderStatus.PENDING, OrderStatus.CONFIRMED);
    this.status = OrderStatus.CANCELED;
  }

  /**
   * Marks a canceled or delivered order as refunded.
   */
  public refund(): void {
    this.ensureStatusIs(OrderStatus.CANCELED, OrderStatus.DELIVERED);
    this.status = OrderStatus.REFUNDED;
  }

  /**
   * Marks the order payment as unpaid.
   */
  public markAsUnpaid(): void {
    this.paymentStatus = PaymentStatus.UNPAID;
  }

  /**
   * Marks the order payment as waiting for payment confirmation.
   */
  public markAsPending(): void {
    this.paymentStatus = PaymentStatus.PENDING;
  }

  /**
   * Marks the order payment as successfully collected.
   */
  public markAsPaid(): void {
    this.paymentStatus = PaymentStatus.PAID;
  }

  /**
   * Marks the order payment as failed.
   */
  public markAsFailed(): void {
    this.paymentStatus = PaymentStatus.FAILED;
  }

  /**
   * Marks the order payment as refunded.
   */
  public markAsRefunded(): void {
    this.paymentStatus = PaymentStatus.REFUNDED;
  }

  /**
   * Calculates the total price from item quantity and captured item price.
   */
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

  public getOrderCode(): string {
    return this.orderCode;
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

  public getShippingAddress(): string {
    return this.shippingAddress;
  }

  public getPhoneNumber(): string {
    return this.phoneNumber;
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
      throw OrderStatusCanNotBeUpdatedException.needToBe(...allowedStatuses);
    }
  }

  private ensurePaymentIsPaid(): void {
    if (this.paymentStatus !== PaymentStatus.PAID) {
      throw new OrderPaymentNeedsToBePaidException();
    }
  }
}
