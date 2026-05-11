export type BookAuthorProps = {
  bookId: string;
  authorId: string;
};

export class BookAuthor {
  private constructor(
    private readonly bookId: string,
    private readonly authorId: string,
  ) {}

  public static create(params: BookAuthorProps): BookAuthor {
    return new BookAuthor(params.bookId, params.authorId);
  }

  public static fromPersistent(params: BookAuthorProps): BookAuthor {
    return new BookAuthor(params.bookId, params.authorId);
  }

  public getBookId(): string {
    return this.bookId;
  }

  public getAuthorId(): string {
    return this.authorId;
  }
}
