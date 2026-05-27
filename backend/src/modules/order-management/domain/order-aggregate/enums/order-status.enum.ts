export enum OrderStatus {
  /** The order has been created and is waiting for confirmation or payment. */
  PENDING = 'pending',

  /** The order has been confirmed and is ready to be processed or packed. */
  CONFIRMED = 'confirmed',

  /** The order has been handed to the carrier and is currently in transit. */
  DELIVERING = 'delivering',

  /** The order has been successfully delivered to the customer. */
  DELIVERED = 'delivered',

  /** The order lifecycle is fully finished and requires no further action. */
  COMPLETED = 'completed',

  /** The order has been canceled by the customer, admin, or system. */
  CANCELED = 'canceled',

  /** The order payment has been refunded after cancellation, return, or payment issue. */
  REFUNDED = 'refunded',
}
