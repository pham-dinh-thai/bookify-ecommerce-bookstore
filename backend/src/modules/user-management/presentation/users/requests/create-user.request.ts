import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ICreateUserRequest } from '../../../application/user-use-cases/create-user/create-user.request';
import { Gender } from '../../../../../shared/domain/enums/gender.enum';

export class CreateUserRequest implements ICreateUserRequest {
  @IsNotEmpty()
  @IsString()
  public readonly firstName!: string;

  @IsNotEmpty()
  @IsString()
  public readonly lastName!: string;

  @IsNotEmpty()
  @IsEmail()
  public readonly email!: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  public readonly gender!: Gender;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  public readonly password!: string;

  @IsNotEmpty()
  @IsString()
  public readonly roleId!: string;
}
