import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IAddBookCoverRequest } from '../../../application/book-use-cases/add-book-cover/add-book-cover.request';

export class AddBookCoverRequest implements IAddBookCoverRequest {
  @IsString()
  @IsNotEmpty()
  url!: string;

  @IsNumber()
  @IsNotEmpty()
  displayOrder!: number;
}
