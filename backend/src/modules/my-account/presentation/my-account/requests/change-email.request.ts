import { IsEmail, IsNotEmpty } from 'class-validator';
import { IChangeEmailRequest } from '../../../application/my-account-use-cases/change-email/change-email.request';

export class ChangeEmailRequest implements IChangeEmailRequest {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
