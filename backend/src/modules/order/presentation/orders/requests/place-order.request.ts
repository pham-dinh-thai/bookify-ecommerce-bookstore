import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { IPlaceOrderRequest } from '../../../application/order-use-cases/place-order/place-order.request';
import { PaymentMethod } from '../../../domain/order-aggregate/enums/payment-method.enum';

class PlaceOrderItemRequest {
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class PlaceOrderRequest implements IPlaceOrderRequest {
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod!: PaymentMethod;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PlaceOrderItemRequest)
  items!: PlaceOrderItemRequest[];
}
