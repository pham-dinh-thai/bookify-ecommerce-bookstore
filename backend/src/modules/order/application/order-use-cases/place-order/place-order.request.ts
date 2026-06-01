import { PaymentMethod } from '../../../domain/order-aggregate/enums/payment-method.enum';

export interface IPlaceOrderRequest {
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
  shippingAddress?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}
