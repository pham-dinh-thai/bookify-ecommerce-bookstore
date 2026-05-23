export interface IBookIsbnDuplicateChecker {
  check(isbn: string): Promise<boolean>;
}

export const BOOK_ISBN_DUPLICATE_CHECKER = 'IBookIsbnDuplicateChecker';
