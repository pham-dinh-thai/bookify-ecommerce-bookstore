import { BookGenreProps } from './types';

export class BookGenre {
  private constructor(
    private readonly bookId: string,
    private readonly genreId: string,
  ) {}

  public static create(props: BookGenreProps): BookGenre {
    return new BookGenre(props.bookId, props.genreId);
  }

  public static fromPersistent(props: BookGenreProps): BookGenre {
    return new BookGenre(props.bookId, props.genreId);
  }

  public getBookId(): string {
    return this.bookId;
  }

  public getGenreId(): string {
    return this.genreId;
  }
}
