import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ICompleteInformationRequest } from '../../../application/customer-use-cases/complete-information/complete-information.request';
import { Gender } from '../../../domain/customer-aggregate/enums/gender.enum';

export class CompleteInformationRequest implements ICompleteInformationRequest {
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender!: Gender;

  @IsNotEmpty()
  address!: {
    provinceCode: string;
    provinceName: string;
    wardCode: string;
    wardName: string;
    street: string;
  };
}
