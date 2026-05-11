export interface IGenreExistsChecker {
  isExists(id: string): Promise<boolean>;

  existsOrThrow(id: string): Promise<void>;
}

export const GENRE_EXISTS_CHECKER = 'IGenreExistsChecker';
