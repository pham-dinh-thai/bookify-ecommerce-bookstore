import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from '../../../../../shared/domain/enums/gender.enum';
import { IUpdateBasicInfoRequest } from '../../../application/my-account-use-cases/update-basic-info/update-basic-info.request';

export class UpdateBasicInfoRequest implements IUpdateBasicInfoRequest {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender!: Gender;
}
