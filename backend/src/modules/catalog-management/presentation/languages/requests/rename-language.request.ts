import { IsNotEmpty, IsString } from 'class-validator';
import { IRenameLanguageRequest } from '../../../application/language-use-cases/rename-language/rename-language.request';

export class RenameLanguageRequest implements IRenameLanguageRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
