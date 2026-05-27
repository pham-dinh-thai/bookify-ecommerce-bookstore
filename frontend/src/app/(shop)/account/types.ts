export type Gender = 'male' | 'female' | 'other';

export type MyBasicInfo = {
  firstName: string;
  lastName: string;
  gender: Gender;
  email: string;
};

export type BasicInfoForm = {
  firstName: string;
  lastName: string;
  gender: Gender;
};

export type EmailForm = {
  email: string;
};

export type ChangePasswordForm = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

export type MyAddress = {
  id: string;
  street: string;
  provinceName: string;
  wardName: string;
  isDefault: boolean;
};

export type MyContactInfo = {
  phoneNumber: string | null;
  addresses: MyAddress[];
};

export type PhoneNumberForm = {
  phoneNumber: string;
};

export type AddressForm = {
  street: string;
  provinceCode: string;
  provinceName: string;
  wardCode: string;
  wardName: string;
};

export type Province = {
  code: string | number;
  name: string;
};

export type Ward = {
  code: string | number;
  name: string;
};

export const genderOptions: Array<{ label: string; value: Gender }> = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Other', value: 'other' },
];
