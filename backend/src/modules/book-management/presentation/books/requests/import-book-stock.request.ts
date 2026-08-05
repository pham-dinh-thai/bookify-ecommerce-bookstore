import { IsNumber } from 'class-validator';
import { IImportBookStockRequest } from '../../../application/use-cases/import-book-stock/import-book-stock.request';

export class ImportBookStockRequest implements IImportBookStockRequest {
  @IsNumber()
  quantity!: number;
}
