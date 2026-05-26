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

export const genderOptions: Array<{ label: string; value: Gender }> = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Other', value: 'other' },
];
