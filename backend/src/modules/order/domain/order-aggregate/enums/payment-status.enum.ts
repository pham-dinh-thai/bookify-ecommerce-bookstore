export enum PaymentStatus {
  /** The payment has not been made yet. */
  UNPAID = 'unpaid',

  /** The payment is waiting for confirmation or processing. */
  PENDING = 'pending',

  /** The payment has been completed successfully. */
  PAID = 'paid',

  /** The payment has been returned to the customer. */
  REFUNDED = 'refunded',
}
