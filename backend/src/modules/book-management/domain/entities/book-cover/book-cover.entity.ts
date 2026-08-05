import { BookCoverCanNotBeRemovedException } from './exceptions/book-cover-can-not-be-removed.exception';
import { BookCoverDisplayOrderNegativeException } from './exceptions/book-cover-display-order-negative.exception';
import { BookCoverIdEmptyException } from './exceptions/book-cover-id-empty.exception';
import { BookCoverUrlEmptyException } from './exceptions/book-cover-url-empty.exception';
import { BookCoverProps, CreateBookCoverProps } from './types';

export class BookCover {
  private constructor(
    private readonly id: string,
    private url: string,
    private isPrimary: boolean,
    private displayOrder: number,
  ) {
    if (!id) {
      throw new BookCoverIdEmptyException();
    }

    if (!url) {
      throw new BookCoverUrlEmptyException();
    }

    if (displayOrder < 0) {
      throw new BookCoverDisplayOrderNegativeException();
    }
  }

  public static create(props: CreateBookCoverProps): BookCover {
    return new BookCover(props.id, props.url, false, props.displayOrder);
  }

  public static fromPersistent(props: BookCoverProps): BookCover {
    return new BookCover(
      props.id,
      props.url,
      props.isPrimary,
      props.displayOrder,
    );
  }

  public ensureCanBeRemoved(): void {
    if (this.isPrimary) {
      throw new BookCoverCanNotBeRemovedException();
    }
  }

  public markAsPrimary(): void {
    this.isPrimary = true;
  }

  public unmarkPrimary(): void {
    this.isPrimary = false;
  }

  public getId(): string {
    return this.id;
  }

  public getUrl(): string {
    return this.url;
  }

  public getIsPrimary(): boolean {
    return this.isPrimary;
  }

  public getDisplayOrder(): number {
    return this.displayOrder;
  }
}
