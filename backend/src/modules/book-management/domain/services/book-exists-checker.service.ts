export interface IBookExistsChecker {
  isExists(id): Promise<boolean>;
}

export const BOOK_EXISTS_CHECKER = 'IBookExistsChecker';
