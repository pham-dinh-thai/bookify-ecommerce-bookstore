export interface IEmailExistsChecker {
  isExists(email: string): Promise<boolean>;
}

export const EMAIL_EXISTS_CHECKER = 'IEmailExistsChecker';
