import { AggregateRoot } from '../../../../shared/domain/aggregate-root';

export class Book extends AggregateRoot {
  private constructor(
    private readonly id: string,
    private isbn: string,
    private title: string,
    private author: string,
    private publisher: string,
    private genreIds: string[],
    private description: string,
    private originalPrice: number,
    private quantity: number,
    private coverImageUrl: string | null,
    private isActive: boolean,
  ) {
    super();
  }

  public static create(params: {
    id: string;
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    genreIds: string[];
    description: string;
    originalPrice: number;
    quantity: number;
    coverImageUrl: string | null;
  }): Book {
    return new Book(
      params.id,
      params.isbn,
      params.title,
      params.author,
      params.publisher,
      params.genreIds,
      params.description,
      params.originalPrice,
      params.quantity,
      params.coverImageUrl,
      true,
    );
  }

  public static fromPersistent(params: {
    id: string;
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    genreIds: string[];
    description: string;
    originalPrice: number;
    quantity: number;
    coverImageUrl: string | null;
    isActive: boolean;
  }): Book {
    return new Book(
      params.id,
      params.isbn,
      params.title,
      params.author,
      params.publisher,
      params.genreIds,
      params.description,
      params.originalPrice,
      params.quantity,
      params.coverImageUrl,
      params.isActive,
    );
  }

  public isInStock(): boolean {
    return this.quantity > 0;
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

  public getAuthor(): string {
    return this.author;
  }

  public getPublisher(): string {
    return this.publisher;
  }

  public getGenreIds(): string[] {
    return [...this.genreIds];
  }

  public getDescription(): string {
    return this.description;
  }

  public getOriginalPrice(): number {
    return this.originalPrice;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getCoverImageUrl(): string | null {
    return this.coverImageUrl;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }
}
