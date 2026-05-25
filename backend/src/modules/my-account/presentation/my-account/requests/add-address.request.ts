import { IsNotEmpty, IsString } from 'class-validator';
import { IAddAddressRequest } from '../../../application/my-account-use-cases/add-address/add-address.request';

export class AddAddressRequest implements IAddAddressRequest {
  @IsString()
  @IsNotEmpty()
  street!: string;

  @IsString()
  @IsNotEmpty()
  provinceCode!: string;

  @IsString()
  @IsNotEmpty()
  provinceName!: string;

  @IsString()
  @IsNotEmpty()
  wardCode!: string;

  @IsString()
  @IsNotEmpty()
  wardName!: string;
}
