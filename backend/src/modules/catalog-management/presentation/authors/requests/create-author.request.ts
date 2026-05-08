import { IsNotEmpty, IsString } from 'class-validator';
import { ICreateAuthorRequest } from '../../../application/author-use-cases/create-author/create-author.request';

export class CreateAuthorRequest implements ICreateAuthorRequest {
  @IsString()
  @IsNotEmpty()
  public readonly name!: string;
}
