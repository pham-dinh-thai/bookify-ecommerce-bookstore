import { Gender } from '../../../../../shared/domain/enums/gender.enum';

export interface ICompleteInformationRequest {
  phoneNumber: string;
  gender: Gender;
  address: {
    street: string;
    provinceCode: string;
    provinceName: string;
    wardCode: string;
    wardName: string;
  };
}
