import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from '../../../../../shared/domain/enums/gender.enum';
import { IUpdateUserRequest } from '../../../application/user-use-cases/update-user/update-user.request';

export class UpdateUserRequest implements IUpdateUserRequest {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender!: Gender;

  @IsString()
  @IsNotEmpty()
  roleId!: string;
}
