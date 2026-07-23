import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { IUpdateItemQuantityRequest } from '../../../application/cart-use-cases/update-item-quantity/update-item-quantity.request';

export class UpdateItemQuantityRequest implements IUpdateItemQuantityRequest {
  @IsInt()
  @Min(1)
  @Max(100)
  @IsNotEmpty()
  quantity!: number;
}
