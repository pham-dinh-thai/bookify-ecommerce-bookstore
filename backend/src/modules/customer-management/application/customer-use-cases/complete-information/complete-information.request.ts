export interface ICompleteInformationRequest {
  phoneNumber: string;
  address: {
    street: string;
    provinceCode: string;
    provinceName: string;
    districtCode: string;
    districtName: string;
    wardCode: string;
    wardName: string;
  };
}
