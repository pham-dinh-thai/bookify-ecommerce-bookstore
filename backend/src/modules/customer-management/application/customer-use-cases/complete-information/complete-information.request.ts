import { Gender } from '../../../domain/customer-aggregate/enums/gender.enum';

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
