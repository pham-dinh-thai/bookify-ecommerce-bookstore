import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { BookCover } from './entities/book-cover/book-cover.entity';
import { BookCoverDisplayOrderDuplicateException } from './entities/book-cover/exceptions/book-cover-display-order-duplicate.exception';
import { BookCoverPrimaryDuplicateException } from './entities/book-cover/exceptions/book-cover-primary-duplicate.exception';
import { BookAuthorEmptyException } from './exceptions/book-author-empty.exception';
import { BookDescriptionEmptyException } from './exceptions/book-description-empty.exception';
import { BookGenreEmptyException } from './exceptions/book-genre-empty.exception';
import { BookIdEmptyException } from './exceptions/book-id-empty.exception';
import { BookIsbnEmptyException } from './exceptions/book-isbn-empty.exception';
import { BookPageCountInvalidException } from './exceptions/book-page-count-invalid.exception';
import { BookTitleEmptyException } from './exceptions/book-title-empty.exception';
import { BookProps, updateBookProps } from './types';
import { BookPrice } from './value-objects/book-price.value-object';
import { BookQuantity } from './value-objects/book-quantity.value-object';

export class Book extends AggregateRoot {
  private constructor(
    private readonly id: string,
    private isbn: string,
    private title: string,
    private authorIds: string[],
    private publisherId: string,
    private genreIds: string[],
    private description: string,
    private originalPrice: BookPrice,
    private quantity: BookQuantity,
    private bookCovers: BookCover[],
    private languageId: string,
    private pageCount: number,
  ) {
    super();

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

  public static create(params: BookProps): Book {
    return new Book(
      params.id,
      params.isbn,
      params.title,
      params.authorIds,
      params.publisherId,
      params.genreIds,
      params.description,
      BookPrice.create(params.originalPrice),
      BookQuantity.create(params.quantity),
      [],
      params.languageId,
      params.pageCount,
    );
  }

  public static fromPersistent(params: BookProps): Book {
    return new Book(
      params.id,
      params.isbn,
      params.title,
      params.authorIds,
      params.publisherId,
      params.genreIds,
      params.description,
      BookPrice.create(params.originalPrice),
      BookQuantity.create(params.quantity),
      (params.bookCovers ?? []).map((cover) => BookCover.fromPersistent(cover)),
      params.languageId,
      params.pageCount,
    );
  }

  public updateDetails(params: updateBookProps): void {
    if (!params.isbn || params.isbn.trim() === '') {
      throw new BookIsbnEmptyException();
    }

    if (!params.title || params.title.trim() === '') {
      throw new BookTitleEmptyException();
    }

    if (!params.authorIds || params.authorIds.length === 0) {
      throw new BookAuthorEmptyException();
    }

    if (!params.genreIds || params.genreIds.length === 0) {
      throw new BookGenreEmptyException();
    }

    if (!params.description || params.description.trim() === '') {
      throw new BookDescriptionEmptyException();
    }

    if (params.pageCount <= 0) {
      throw new BookPageCountInvalidException();
    }

    this.isbn = params.isbn;
    this.title = params.title;
    this.authorIds = params.authorIds;
    this.publisherId = params.publisherId;
    this.genreIds = params.genreIds;
    this.description = params.description;
    this.languageId = params.languageId;
    this.pageCount = params.pageCount;
  }

  public addCover(cover: BookCover): void {
    if (
      cover.getIsPrimary() &&
      this.bookCovers.some((existing) => existing.getIsPrimary())
    ) {
      throw new BookCoverPrimaryDuplicateException();
    }

    if (
      this.bookCovers.some(
        (existing) => existing.getDisplayOrder() === cover.getDisplayOrder(),
      )
    ) {
      throw new BookCoverDisplayOrderDuplicateException();
    }

    if (this.bookCovers.length === 0) {
      cover.markAsPrimary();
    }

    this.bookCovers.push(cover);
  }

  public updatePrice(newPrice: number): void {
    this.originalPrice = this.originalPrice.updatePrice(newPrice);
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
