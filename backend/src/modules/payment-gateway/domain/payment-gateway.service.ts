import {
  CreateGatewayPaymentRequest,
  CreateGatewayPaymentResponse,
} from './payment-gateway.types';

export interface IPaymentGatewayService {
  createPayment(
    request: CreateGatewayPaymentRequest,
  ): Promise<CreateGatewayPaymentResponse>;
}

export const PAYMENT_GATEWAY_SERVICE = 'IPaymentGatewayService';
