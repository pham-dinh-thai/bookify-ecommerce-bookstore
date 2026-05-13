export type BookCover = {
  id: string;
  bookId: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
};

export type Book = {
  id: string;
  isbn: string;
  title: string;
  authorIds: string[];
  publisherId: string;
  genreIds: string[];
  description: string;
  originalPrice: number;
  quantity: number;
  bookCovers: BookCover[];
  languageId: string;
  pageCount: number;
};
