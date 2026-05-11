export interface IBookValidation {
  validateBookRelations(request: {
    authorIds: string[];
    publisherId: string;
    genreIds: string[];
    languageId: string;
  }): Promise<void>;
}

export const BOOK_VALIDATION = 'IBookValidation';
