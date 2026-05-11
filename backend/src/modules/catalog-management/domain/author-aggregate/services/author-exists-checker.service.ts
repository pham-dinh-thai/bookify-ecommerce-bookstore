export interface IAuthorExistsChecker {
  isExists(id: string): Promise<boolean>;

  existsOrThrow(id: string): Promise<void>;
}

export const AUTHOR_EXISTS_CHECKER = 'IAuthorExistsChecker';
