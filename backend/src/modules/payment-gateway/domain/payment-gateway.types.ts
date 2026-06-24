export type CreateGatewayPaymentRequest = {
  orderId: string;
  amount: number;
  orderInfo: string;
  returnUrl: string;
};

export type CreateGatewayPaymentResponse = {
  providerOrderId: string;
  payUrl: string;
  rawResponse: Record<string, any>;
};
