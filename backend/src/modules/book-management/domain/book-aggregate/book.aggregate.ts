import { BookCover } from './entities/book-cover/book-cover.entity';
import { BookCoverDisplayOrderDuplicateException } from './entities/book-cover/exceptions/book-cover-display-order-duplicate.exception';
import { BookCoverNotFoundException } from './entities/book-cover/exceptions/book-cover-not-found.exception';
import { BookCoverPrimaryDuplicateException } from './entities/book-cover/exceptions/book-cover-primary-duplicate.exception';
import { BookAuthorEmptyException } from './entities/book-author/exceptions/book-author-empty.exception';
import { BookDescriptionEmptyException } from './exceptions/book-description-empty.exception';
import { BookGenreEmptyException } from './exceptions/book-genre-empty.exception';
import { BookIdEmptyException } from './exceptions/book-id-empty.exception';
import { BookIsbnEmptyException } from './exceptions/book-isbn-empty.exception';
import { BookPageCountInvalidException } from './exceptions/book-page-count-invalid.exception';
import { BookTitleEmptyException } from './exceptions/book-title-empty.exception';
import {
  CreateBookProps,
  FromPersistentBookProps,
  UpdateBookProps,
} from './types';
import { BookPrice } from './value-objects/book-price.value-object';
import { BookQuantity } from './value-objects/book-quantity.value-object';
import { CreateBookCoverProps } from './entities/book-cover/types';
import { BookDiscountPercentage } from './value-objects/book-discount-percentage.value-object';

/**
 * Book aggregate root.
 *
 * Rules:
 * - Must have at least one author and one genre
 * - Title, ISBN, and description cannot be empty
 * - Page count must be greater than zero
 * - Cannot have more than one primary cover
 * - Cannot have duplicate display orders across covers
 * - First cover added is automatically set as primary
 * - Quantity cannot be negative
 * - Discount percentage must be between 0 and 100
 * - Price, discount, and stock changes are managed through dedicated methods
 */
export class Book {
  private constructor(
    private readonly id: string,
    private isbn: string,
    private title: string,
    private authorIds: string[],
    private publisherId: string,
    private genreIds: string[],
    private description: string,
    private originalPrice: BookPrice,
    private discountPercentage: BookDiscountPercentage,
    private quantity: BookQuantity,
    private bookCovers: BookCover[],
    private languageId: string,
    private pageCount: number,
  ) {
    if (!id) {
      throw new BookIdEmptyException();
    }

    if (!isbn) {
      throw new BookIsbnEmptyException();
    }

    if (!title || title.trim() === '') {
      throw new BookTitleEmptyException();
    }

    if (!authorIds || authorIds.length === 0) {
      throw new BookAuthorEmptyException();
    }

    if (!genreIds || genreIds.length === 0) {
      throw new BookGenreEmptyException();
    }

    if (!description || description.trim() === '') {
      throw new BookDescriptionEmptyException();
    }

    if (pageCount <= 0) {
      throw new BookPageCountInvalidException();
    }
  }

  /**
   * Creates a new Book with the given properties. Covers are added separately after creation.
   */
  public static create(props: CreateBookProps): Book {
    return new Book(
      props.id,
      props.isbn,
      props.title,
      props.authorIds,
      props.publisherId,
      props.genreIds,
      props.description,
      BookPrice.create(props.originalPrice),
      BookDiscountPercentage.create(0),
      BookQuantity.create(props.quantity),
      [],
      props.languageId,
      props.pageCount,
    );
  }

  /**
   * Reconstructs a Book from persisted data.
   */
  public static fromPersistent(props: FromPersistentBookProps): Book {
    return new Book(
      props.id,
      props.isbn,
      props.title,
      props.authorIds,
      props.publisherId,
      props.genreIds,
      props.description,
      BookPrice.create(props.originalPrice),
      BookDiscountPercentage.create(props.discountPercentage ?? 0),
      BookQuantity.create(props.quantity),
      (props.bookCovers ?? []).map((cover) => BookCover.fromPersistent(cover)),
      props.languageId,
      props.pageCount,
    );
  }

  /**
   * Replaces all mutable book details except price, discount, and quantity,
   * which have dedicated methods for auditability.
   */
  public updateDetails(props: UpdateBookProps): void {
    if (!props.isbn || props.isbn.trim() === '') {
      throw new BookIsbnEmptyException();
    }

    if (!props.title || props.title.trim() === '') {
      throw new BookTitleEmptyException();
    }

    if (!props.authorIds || props.authorIds.length === 0) {
      throw new BookAuthorEmptyException();
    }

    if (!props.genreIds || props.genreIds.length === 0) {
      throw new BookGenreEmptyException();
    }

    if (!props.description || props.description.trim() === '') {
      throw new BookDescriptionEmptyException();
    }

    if (props.pageCount <= 0) {
      throw new BookPageCountInvalidException();
    }

    this.isbn = props.isbn;
    this.title = props.title;
    this.authorIds = props.authorIds;
    this.publisherId = props.publisherId;
    this.genreIds = props.genreIds;
    this.description = props.description;
    this.languageId = props.languageId;
    this.pageCount = props.pageCount;
  }

  /**
   * Adds a cover. Automatically promotes to primary if no covers exist.
   */
  public addCover(props: CreateBookCoverProps): BookCover {
    const cover = BookCover.create(props);

    const primaryCoverExists = this.bookCovers.some((existing) =>
      existing.getIsPrimary(),
    );
    if (cover.getIsPrimary() && primaryCoverExists) {
      throw new BookCoverPrimaryDuplicateException();
    }

    const isDisplayOrderDuplicate = this.bookCovers.some(
      (existing) => existing.getDisplayOrder() === cover.getDisplayOrder(),
    );
    if (isDisplayOrderDuplicate) {
      throw new BookCoverDisplayOrderDuplicateException();
    }

    const isBookCoverEmpty = this.bookCovers.length === 0;
    if (isBookCoverEmpty) {
      cover.markAsPrimary();
    }

    this.bookCovers.push(cover);

    return cover;
  }

  /**
   * Removes a cover by ID. Throws if cover not found or if it's the primary cover.
   */
  public removeCover(coverId: string): BookCover {
    const removedCover = this.bookCovers.find(
      (cover) => cover.getId() === coverId,
    );
    if (!removedCover) {
      throw new BookCoverNotFoundException();
    }

    removedCover.ensureCanBeRemoved();

    this.bookCovers = this.bookCovers.filter(
      (cover) => cover.getId() !== coverId,
    );

    return removedCover;
  }

  /**
   * Changes the primary cover to the given cover ID.
   * Throws if cover not found or already primary.
   */
  public promoteCoverToPrimary(coverId: string): void {
    const newPrimary = this.bookCovers.find(
      (cover) => cover.getId() === coverId,
    );
    if (!newPrimary) {
      throw new BookCoverNotFoundException();
    }

    const currentPrimary = this.bookCovers.find((cover) =>
      cover.getIsPrimary(),
    );
    if (currentPrimary?.getId() === coverId) {
      return;
    }

    currentPrimary?.unmarkPrimary();
    newPrimary.markAsPrimary();
  }

  public updatePrice(newPrice: number): void {
    this.originalPrice = this.originalPrice.updatePrice(newPrice);
  }

  public updateDiscountPercentage(newDiscountPercentage: number): void {
    this.discountPercentage = this.discountPercentage.update(
      newDiscountPercentage,
    );
  }

  public adjustQuantity(quantity: number): void {
    this.quantity = this.quantity.update(quantity);
  }

  public increaseQuantity(quantity: number): void {
    this.quantity = this.quantity.increase(quantity);
  }

  public decreaseQuantity(quantity: number): void {
    this.quantity = this.quantity.decrease(quantity);
  }

  public isInStock(): boolean {
    return this.quantity.isInStock();
  }

  public getId(): string {
    return this.id;
  }

  public getIsbn(): string {
    return this.isbn;
  }

  public getTitle(): string {
    return this.title;
  }

  public getAuthorIds(): string[] {
    return [...this.authorIds];
  }

  public getPublisherId(): string {
    return this.publisherId;
  }

  public getGenreIds(): string[] {
    return [...this.genreIds];
  }

  public getDescription(): string {
    return this.description;
  }

  public getOriginalPrice(): number {
    return this.originalPrice.getValue();
  }

  public getDiscountPercentage(): number {
    return this.discountPercentage.getValue();
  }

  public getQuantity(): number {
    return this.quantity.getValue();
  }

  public getBookCovers(): BookCover[] {
    return [...this.bookCovers];
  }

  public getLanguageId(): string {
    return this.languageId;
  }

  public getPageCount(): number {
    return this.pageCount;
  }
}
