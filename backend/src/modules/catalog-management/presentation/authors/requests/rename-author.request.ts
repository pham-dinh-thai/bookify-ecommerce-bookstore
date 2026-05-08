import { IsNotEmpty, IsString } from 'class-validator';
import { IRenameAuthorRequest } from '../../../application/author-use-cases/rename-author/rename-author.request';

export class RenameAuthorRequest implements IRenameAuthorRequest {
  @IsString()
  @IsNotEmpty()
  public readonly name!: string;
}
