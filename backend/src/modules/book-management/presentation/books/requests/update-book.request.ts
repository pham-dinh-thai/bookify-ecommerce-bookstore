import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { IUpdateBookRequest } from '../../../application/use-cases/update-book/update-book.request';

export class UpdateBookRequest implements IUpdateBookRequest {
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

  @IsString()
  @IsNotEmpty()
  languageId!: string;

  @IsNumber()
  @IsNotEmpty()
  pageCount!: number;
}
