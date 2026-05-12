import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ICreateBookRequest } from '../../../application/book-use-cases/create-book/create-book.request';

export class CreateBookRequest implements ICreateBookRequest {
  @IsString()
  @IsNotEmpty()
  isbn!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  authorIds!: string[];

  @IsString()
  @IsNotEmpty()
  publisherId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  genreIds!: string[];

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  originalPrice!: number;

  @IsNumber()
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  coverUrl!: string;

  @IsString()
  @IsNotEmpty()
  languageId!: string;

  @IsNumber()
  @IsNotEmpty()
  pageCount!: number;
}
