export type BookCover = {
  id: string;
  bookId: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
};

export type Book = {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  originalPrice: number;
  bookCovers: BookCover[];
};

export type CreateBookForm = {
  isbn: string;
  title: string;
  description: string;
  originalPrice: number;
  quantity: number;
  authorIds: string[];
  publisherId: string;
  genreIds: string[];
  languageId: string;
  pageCount: number;
  coverUrl: string;
};

export type CreateBookFormErrors = Record<string, string | undefined>;
