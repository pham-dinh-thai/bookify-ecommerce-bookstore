export enum PaymentMethod {
  /** The customer pays in cash when the order is delivered. */
  CASH_ON_DELIVERY = 'cash_on_delivery',

  /** The customer pays using the MoMo mock/e-wallet payment flow. */
  E_WALLET = 'e_wallet',
}
