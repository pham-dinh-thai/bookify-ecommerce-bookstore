import { BookAuthorProps } from './types';

export class BookAuthor {
  private constructor(
    private readonly bookId: string,
    private readonly authorId: string,
  ) {}

  public static create(props: BookAuthorProps): BookAuthor {
    return new BookAuthor(props.bookId, props.authorId);
  }

  public static fromPersistent(props: BookAuthorProps): BookAuthor {
    return new BookAuthor(props.bookId, props.authorId);
  }

  public getBookId(): string {
    return this.bookId;
  }

  public getAuthorId(): string {
    return this.authorId;
  }
}
