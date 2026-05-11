export interface ILanguageExistsChecker {
  isExists(id: string): Promise<boolean>;

  existsOrThrow(id: string): Promise<void>;
}

export const LANGUAGE_EXISTS_CHECKER = 'ILanguageExistsChecker';
