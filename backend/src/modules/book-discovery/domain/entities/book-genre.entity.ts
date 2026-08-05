import { FromPersistentBookGenreProps } from '../types';

export class BookGenre {
  public constructor(
    private readonly id: string,
    private readonly name: string,
  ) {}

  public static fromPersistent(props: FromPersistentBookGenreProps): BookGenre {
    return new BookGenre(props.id, props.name);
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }
}
