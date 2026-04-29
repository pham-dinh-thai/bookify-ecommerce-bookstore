export interface ICompleteInformationRequest {
  phoneNumber: string;
  address: {
    street: string;
    provinceCode: string;
    provinceName: string;
    wardCode: string;
    wardName: string;
  };
}
