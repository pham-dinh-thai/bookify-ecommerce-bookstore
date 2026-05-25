import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IChangePasswordRequest } from '../../../application/my-account-use-cases/change-password/change-password.request';

export class ChangePasswordRequest implements IChangePasswordRequest {
  @IsString()
  @IsNotEmpty()
  oldPassword!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPasswordConfirmation!: string;
}
