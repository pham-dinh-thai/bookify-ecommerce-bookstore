import { FromPersistentBookAuthorProps } from '../types';

export class BookAuthor {
  public constructor(private readonly name: string) {}

  public static fromPersistent(
    props: FromPersistentBookAuthorProps,
  ): BookAuthor {
    return new BookAuthor(props.name);
  }

  public getName(): string {
    return this.name;
  }
}
