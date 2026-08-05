import { BookCoverProps } from './entities/book-cover/types';

export type CreateBookProps = {
  id: string;
  isbn: string;
  title: string;
  authorIds: string[];
  publisherId: string;
  genreIds: string[];
  description: string;
  originalPrice: number;
  quantity: number;
  languageId: string;
  pageCount: number;
};

export type FromPersistentBookProps = {
  id: string;
  isbn: string;
  title: string;
  authorIds: string[];
  publisherId: string;
  genreIds: string[];
  description: string;
  originalPrice: number;
  discountPercentage?: number;
  quantity: number;
  languageId: string;
  pageCount: number;
  bookCovers?: BookCoverProps[];
};

export type UpdateBookProps = {
  isbn: string;
  title: string;
  authorIds: string[];
  publisherId: string;
  genreIds: string[];
  description: string;
  languageId: string;
  pageCount: number;
};
