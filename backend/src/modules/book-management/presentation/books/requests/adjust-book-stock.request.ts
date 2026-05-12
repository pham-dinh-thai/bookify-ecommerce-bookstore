import { IsNumber } from 'class-validator';
import { IAdjustBookStockRequest } from '../../../application/book-use-cases/adjust-book-stock/adjust-book-stock.request';

export class AdjustBookStockRequest implements IAdjustBookStockRequest {
  @IsNumber()
  quantity!: number;
}
