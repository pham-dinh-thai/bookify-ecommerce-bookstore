import { PaymentMethod } from '../../../domain/order-aggregate/enums/payment-method.enum';

export interface IPlaceOrderRequest {
  paymentMethod: PaymentMethod;
  items: {
    productId: string;
    quantity: number;
  }[];
}
