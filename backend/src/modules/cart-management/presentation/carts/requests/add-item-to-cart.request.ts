import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IAddItemToCartRequest } from '../../../application/cart-use-cases/add-item-to-cart/add-item-to-cart.request';

export class AddItemToCartRequest implements IAddItemToCartRequest {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsInt()
  @IsNotEmpty()
  quantity!: number;

  @IsNumber()
  @IsNotEmpty()
  price!: number;
}
