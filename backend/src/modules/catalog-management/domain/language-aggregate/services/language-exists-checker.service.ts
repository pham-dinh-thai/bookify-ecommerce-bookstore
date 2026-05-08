export interface ILanguageExistsChecker {
  isExists(id: string): Promise<boolean>;
}

export const LANGUAGE_EXISTS_CHECKER = 'ILanguageExistsChecker';
