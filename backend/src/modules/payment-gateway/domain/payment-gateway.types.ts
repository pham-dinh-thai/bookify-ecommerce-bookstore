export type CreateGatewayPaymentRequest = {
  orderId: string;
  amount: number;
  orderInfo: string;
};

export type CreateGatewayPaymentResponse = {
  providerOrderId: string;
  payUrl: string;
  rawResponse: Record<string, any>;
};
