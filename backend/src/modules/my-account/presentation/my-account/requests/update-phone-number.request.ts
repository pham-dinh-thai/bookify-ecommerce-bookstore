import { IsNotEmpty, IsString } from 'class-validator';
import { IUpdatePhoneNumberRequest } from '../../../application/my-account-use-cases/update-phone-number/update-phone-number.request';

export class UpdatePhoneNumberRequest implements IUpdatePhoneNumberRequest {
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;
}
