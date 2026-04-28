import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IRegisterRequest } from '../../application/use-cases/register/register.request';

export class RegisterRequest implements IRegisterRequest {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  passwordConfirmation!: string;
}
