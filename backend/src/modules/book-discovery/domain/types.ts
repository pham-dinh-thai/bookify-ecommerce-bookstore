import type { BookAuthor } from './entities/book-author.entity';
import type { BookCover } from './entities/book-cover.entity';
import type { BookGenre } from './entities/book-genre.entity';

export type FromPersistentBookProps = {
  id: string;
  title: string;
  publisher: string;
  authors: BookAuthor[];
  originalPrice: number;
  discountPercentage: number;
  quantity: number;
  genres: BookGenre[];
  covers: BookCover[];
};

export type FromPersistentBookAuthorProps = {
  name: string;
};

export type FromPersistentBookGenreProps = {
  id: string;
  name: string;
};

export type FromPersistentBookCoverProps = {
  url: string;
  isPrimary: boolean;
};

export type DiscoveryBookCollectionType =
  | 'best-seller'
  | 'on-sales'
  | 'new-arrivals';
