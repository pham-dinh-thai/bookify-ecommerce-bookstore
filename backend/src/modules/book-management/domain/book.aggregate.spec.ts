import { Book } from './book.aggregate';
import { BookPriceDecreased } from './events/book-price-decreased.event';
import { BookDiscountUpdated } from './events/book-discount-updated.event';
import { BookRestocked } from './events/book-restocked.event';
import { FromPersistentBookProps } from './types';

const baseBookProps = (): FromPersistentBookProps => ({
  id: 'book-1',
  isbn: '978-0134494166',
  title: 'Clean Architecture',
  authorIds: ['author-1'],
  publisherId: 'publisher-1',
  genreIds: ['genre-1'],
  description: 'A book about software architecture.',
  originalPrice: 500000,
  discountPercentage: 0,
  quantity: 10,
  languageId: 'language-1',
  pageCount: 400,
});

const baseBook = () => Book.fromPersistent(baseBookProps());

describe('Book aggregate', () => {
  describe('updatePrice', () => {
    it('records a BookPriceDecreased event when the price drops', () => {
      const book = baseBook();

      book.updatePrice(400000);

      const events = book.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(BookPriceDecreased);
      expect(events[0]).toEqual(
        expect.objectContaining({
          bookId: 'book-1',
          title: 'Clean Architecture',
          oldPrice: 500000,
          newPrice: 400000,
        }),
      );
    });

    it('records the event based on the discounted price', () => {
      const book = Book.fromPersistent({
        ...baseBookProps(),
        discountPercentage: 20,
      });

      book.updatePrice(300000);

      const events = book.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toEqual(
        expect.objectContaining({ oldPrice: 400000, newPrice: 240000 }),
      );
    });

    it('does not record an event when the price increases', () => {
      const book = baseBook();

      book.updatePrice(600000);

      expect(book.getDomainEvents()).toHaveLength(0);
    });

    it('does not record an event when the price is unchanged', () => {
      const book = baseBook();

      book.updatePrice(500000);

      expect(book.getDomainEvents()).toHaveLength(0);
    });
  });

  describe('updateDiscountPercentage', () => {
    it('records a BookDiscountUpdated event when the discount increases', () => {
      const book = baseBook();

      book.updateDiscountPercentage(20);

      const events = book.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(BookDiscountUpdated);
      expect(events[0]).toEqual(
        expect.objectContaining({
          bookId: 'book-1',
          oldPrice: 500000,
          newPrice: 400000,
          discountPercentage: 20,
        }),
      );
    });

    it('does not record an event when the discount decreases', () => {
      const book = Book.fromPersistent({
        ...baseBookProps(),
        discountPercentage: 20,
      });

      book.updateDiscountPercentage(0);

      expect(book.getDomainEvents()).toHaveLength(0);
    });
  });

  describe('increaseQuantity', () => {
    it('records a BookRestocked event when the book becomes available again', () => {
      const book = Book.fromPersistent({ ...baseBookProps(), quantity: 0 });

      book.increaseQuantity(5);

      const events = book.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(BookRestocked);
      expect(events[0]).toEqual(
        expect.objectContaining({
          bookId: 'book-1',
          title: 'Clean Architecture',
          quantity: 5,
        }),
      );
    });

    it('does not record an event when the book is already in stock', () => {
      const book = baseBook();

      book.increaseQuantity(5);

      expect(book.getDomainEvents()).toHaveLength(0);
    });
  });

  describe('adjustQuantity', () => {
    it('records a BookRestocked event when the book becomes available again', () => {
      const book = Book.fromPersistent({ ...baseBookProps(), quantity: 0 });

      book.adjustQuantity(10);

      const events = book.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(BookRestocked);
      expect(events[0]).toEqual(
        expect.objectContaining({ bookId: 'book-1', quantity: 10 }),
      );
    });

    it('does not record an event when the book is already in stock', () => {
      const book = baseBook();

      book.adjustQuantity(0);

      expect(book.getDomainEvents()).toHaveLength(0);
    });

    it('does not record an event when the book stays out of stock', () => {
      const book = Book.fromPersistent({ ...baseBookProps(), quantity: 0 });

      book.adjustQuantity(0);

      expect(book.getDomainEvents()).toHaveLength(0);
    });
  });

  describe('domain events', () => {
    it('accumulates multiple events', () => {
      const book = Book.fromPersistent({ ...baseBookProps(), quantity: 0 });

      book.updatePrice(400000);
      book.increaseQuantity(5);

      expect(book.getDomainEvents()).toHaveLength(2);
    });

    it('clears recorded events', () => {
      const book = baseBook();

      book.updatePrice(400000);
      book.clearDomainEvents();

      expect(book.getDomainEvents()).toHaveLength(0);
    });
  });
});
