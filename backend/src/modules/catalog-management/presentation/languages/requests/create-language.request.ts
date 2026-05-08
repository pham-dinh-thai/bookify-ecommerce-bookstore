import { IsNotEmpty, IsString } from 'class-validator';
import { ICreateLanguageRequest } from '../../../application/language-use-cases/create-language/create-language.request';

export class CreateLanguageRequest implements ICreateLanguageRequest {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}
