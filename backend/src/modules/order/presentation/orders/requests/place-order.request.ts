import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { IPlaceOrderRequest } from '../../../application/order-use-cases/place-order/place-order.request';
import { PaymentMethod } from '../../../domain/order-aggregate/enums/payment-method.enum';

export class PlaceOrderRequest implements IPlaceOrderRequest {
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod!: PaymentMethod;

  @IsArray()
  @IsNotEmpty()
  items!: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}
