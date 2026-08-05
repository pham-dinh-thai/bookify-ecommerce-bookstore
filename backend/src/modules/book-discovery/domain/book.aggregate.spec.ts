import { Book } from './book.aggregate';
import { BookAuthor } from './entities/book-author.entity';
import { BookCover } from './entities/book-cover.entity';
import { BookGenre } from './entities/book-genre.entity';

const baseBookProps = () => ({
  id: 'book-1',
  title: 'Clean Architecture',
  publisher: 'Pearson',
  authors: [BookAuthor.fromPersistent({ name: 'Robert C. Martin' })],
  originalPrice: 500000,
  discountPercentage: 0,
  quantity: 10,
  genres: [BookGenre.fromPersistent({ id: 'genre-1', name: 'Technology' })],
  covers: [BookCover.fromPersistent({ url: '/cover.jpg', isPrimary: true })],
});

const baseBook = () => Book.fromPersistent(baseBookProps());

describe('Book aggregate', () => {
  describe('getCurrentPrice', () => {
    it('returns the original price when there is no discount', () => {
      expect(baseBook().getCurrentPrice()).toBe(500000);
    });

    it('applies the discount percentage', () => {
      const book = Book.fromPersistent({
        ...baseBookProps(),
        discountPercentage: 20,
      });

      expect(book.getCurrentPrice()).toBe(400000);
    });

    it('never returns a negative price', () => {
      const book = Book.fromPersistent({
        ...baseBookProps(),
        discountPercentage: 200,
      });

      expect(book.getCurrentPrice()).toBe(0);
    });
  });

  describe('isOnSale', () => {
    it('returns true when the discount percentage is greater than zero', () => {
      const book = Book.fromPersistent({
        ...baseBookProps(),
        discountPercentage: 10,
      });

      expect(book.isOnSale()).toBe(true);
    });

    it('returns false when there is no discount', () => {
      expect(baseBook().isOnSale()).toBe(false);
    });
  });

  describe('isInStock', () => {
    it('returns true when quantity is greater than zero', () => {
      expect(baseBook().isInStock()).toBe(true);
    });

    it('returns false when quantity is zero', () => {
      const book = Book.fromPersistent({ ...baseBookProps(), quantity: 0 });

      expect(book.isInStock()).toBe(false);
    });
  });

  describe('getters', () => {
    it('exposes the persisted properties', () => {
      const book = baseBook();

      expect(book.getId()).toBe('book-1');
      expect(book.getTitle()).toBe('Clean Architecture');
      expect(book.getPublisher()).toBe('Pearson');
      expect(book.getAuthors().map((author) => author.getName())).toEqual([
        'Robert C. Martin',
      ]);
      expect(book.getGenres().map((genre) => genre.getName())).toEqual([
        'Technology',
      ]);
      expect(book.getCovers().map((cover) => cover.getUrl())).toEqual([
        '/cover.jpg',
      ]);
    });
  });
});
