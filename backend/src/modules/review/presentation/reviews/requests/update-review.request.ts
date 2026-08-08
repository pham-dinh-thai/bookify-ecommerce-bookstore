import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IUpdateReviewRequest } from '../../../application/use-cases/update-review/update-review.request';

export class UpdateReviewRequest implements IUpdateReviewRequest {
  @IsNumber()
  @IsNotEmpty()
  rating!: number;

  @IsOptional()
  @IsString()
  comment?: string | null;
}
