export interface IPhoneNumberExistsChecker {
  exists(phoneNumber: string): Promise<boolean>;
}

export const PHONE_NUMBER_EXISTS_CHECKER = 'IPhoneNumberExistsChecker';
