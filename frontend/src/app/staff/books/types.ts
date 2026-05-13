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
