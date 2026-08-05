import { BookAuthor } from './entities/book-author.entity';
import { BookCover } from './entities/book-cover.entity';
import { BookGenre } from './entities/book-genre.entity';
import { FromPersistentBookProps } from './types';

export class Book {
  public constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly publisher: string,
    private readonly authors: BookAuthor[],
    private readonly originalPrice: number,
    private readonly discountPercentage: number,
    private readonly quantity: number,
    private readonly genres: BookGenre[],
    private readonly covers: BookCover[],
  ) {}

  public static fromPersistent(props: FromPersistentBookProps): Book {
    return new Book(
      props.id,
      props.title,
      props.publisher,
      props.authors,
      props.originalPrice,
      props.discountPercentage,
      props.quantity,
      props.genres,
      props.covers,
    );
  }

  public getCurrentPrice(): number {
    return Math.max(
      0,
      this.originalPrice * (1 - this.discountPercentage / 100),
    );
  }

  public isOnSale(): boolean {
    return this.discountPercentage > 0;
  }

  public isInStock(): boolean {
    return this.quantity > 0;
  }

  public getId(): string {
    return this.id;
  }

  public getTitle(): string {
    return this.title;
  }

  public getPublisher(): string {
    return this.publisher;
  }

  public getAuthors(): BookAuthor[] {
    return [...this.authors];
  }

  public getOriginalPrice(): number {
    return this.originalPrice;
  }

  public getDiscountPercentage(): number {
    return this.discountPercentage;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getGenres(): BookGenre[] {
    return [...this.genres];
  }

  public getCovers(): BookCover[] {
    return [...this.covers];
  }
}
