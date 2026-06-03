import { IsNotEmpty, IsNumber } from 'class-validator';
import { IUpdateBookDiscountPercentageRequest } from '../../../application/book-use-cases/update-book-discount-percentage/update-book-discount-percentage.request';

export class UpdateBookDiscountPercentageRequest implements IUpdateBookDiscountPercentageRequest {
  @IsNumber()
  @IsNotEmpty()
  discountPercentage!: number;
}
