import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IAddReviewRequest } from '../../../application/use-cases/add-review/add-review.request';

export class AddReviewRequest implements IAddReviewRequest {
  @IsNumber()
  @IsNotEmpty()
  rating!: number;

  @IsOptional()
  @IsString()
  comment?: string | null;
}
