import { FromPersistentBookCoverProps } from '../types';

export class BookCover {
  public constructor(
    private readonly url: string,
    private readonly isPrimary: boolean,
  ) {}

  public static fromPersistent(props: FromPersistentBookCoverProps): BookCover {
    return new BookCover(props.url, props.isPrimary);
  }

  public getUrl(): string {
    return this.url;
  }

  public isPrimaryCover(): boolean {
    return this.isPrimary;
  }
}
