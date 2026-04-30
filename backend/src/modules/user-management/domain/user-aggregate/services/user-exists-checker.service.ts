export interface IUserExistsChecker {
  isExists(id: string): Promise<boolean>;
}

export const USER_EXISTS_CHECKER = 'IUserExistsChecker';
