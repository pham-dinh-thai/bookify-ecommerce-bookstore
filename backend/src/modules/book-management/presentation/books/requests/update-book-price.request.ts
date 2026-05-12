import { IsNumber } from 'class-validator';
import { IUpdateBookPriceRequest } from '../../../application/book-use-cases/update-book-price/update-book-price.request';

export class UpdateBookPriceRequest implements IUpdateBookPriceRequest {
  @IsNumber()
  price!: number;
}
