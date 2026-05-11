export type BookGenreProps = {
  bookId: string;
  genreId: string;
};

export class BookGenre {
  private constructor(
    private readonly bookId: string,
    private readonly genreId: string,
  ) {}

  public static create(params: BookGenreProps): BookGenre {
    return new BookGenre(params.bookId, params.genreId);
  }

  public static fromPersistent(params: BookGenreProps): BookGenre {
    return new BookGenre(params.bookId, params.genreId);
  }

  public getBookId(): string {
    return this.bookId;
  }

  public getGenreId(): string {
    return this.genreId;
  }
}
