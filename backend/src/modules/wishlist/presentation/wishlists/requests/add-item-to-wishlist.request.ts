import { IsNotEmpty, IsString } from 'class-validator';
import { IAddItemToWishlistRequest } from '../../../application/use-cases/add-item-to-wishlist/add-item-to-wishlist.request';

export class AddItemToWishlistRequest implements IAddItemToWishlistRequest {
  @IsString()
  @IsNotEmpty()
  itemId!: string;
}
