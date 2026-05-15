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
  covers: BookCover[];
  isInStock: boolean;
  status: string;
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

export type BookDetail = {
  id: string;
  isbn: string;
  title: string;
  description: string;
  originalPrice: number;
  quantity: number;
  pageCount: number;
  isInStock: boolean;
  language: string;
  publisher: string;
  authors: string[];
  genres: string[];
  covers?: {
    id: string;
    url: string;
    isPrimary: boolean;
    displayOrder: number;
  }[];
};

export type CreateBookFormErrors = Record<string, string | undefined>;
