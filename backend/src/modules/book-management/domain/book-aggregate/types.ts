import { BookCoverProps } from './entities/book-cover/book-cover.entity';

export type BookProps = {
  id: string;
  isbn: string;
  title: string;
  authorIds: string[];
  publisherId: string;
  genreIds: string[];
  description: string;
  originalPrice: number;
  quantity: number;
  bookCovers?: BookCoverProps[];
  languageId: string;
  pageCount: number;
};

export type updateBookProps = {
  isbn: string;
  title: string;
  authorIds: string[];
  publisherId: string;
  genreIds: string[];
  description: string;
  languageId: string;
  pageCount: number;
};
