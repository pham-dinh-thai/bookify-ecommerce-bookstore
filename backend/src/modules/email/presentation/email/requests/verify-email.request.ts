import { IsString } from 'class-validator';
import { IVerifyEmailRequest } from '../../../application/use-cases/verify-email.request';

export class VerifyEmailRequest implements IVerifyEmailRequest {
  @IsString()
  otp!: string;
}
