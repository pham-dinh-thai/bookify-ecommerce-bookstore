export enum PaymentMethod {
  /** The customer pays in cash when the order is delivered. */
  CASH_ON_DELIVERY = 'cash_on_delivery',

  /** The customer pays by bank transfer. Payment may need manual confirmation. */
  BANK_TRANSFER = 'bank_transfer',

  /** The customer pays using a credit or debit card. */
  CARD = 'card',

  /** The customer pays using an e-wallet such as MoMo, ZaloPay, or similar services. */
  E_WALLET = 'e_wallet',
}
