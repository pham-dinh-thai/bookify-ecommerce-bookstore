import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSessionTitleRequest {
  @IsString()
  @IsNotEmpty()
  title!: string;
}
