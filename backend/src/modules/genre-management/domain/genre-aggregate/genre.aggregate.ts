import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { EmptyGenreIdException } from './exceptions/empty-genre-id.exception';
import { EmptyGenreNameException } from './exceptions/empty-genre-name.exception';

export class Genre extends AggregateRoot {
  public constructor(
    private readonly id: string,
    private name: string,
  ) {
    super();
  }

  public static create(id: string, name: string): Genre {
    if (!id) {
      throw new EmptyGenreIdException();
    }

    if (!name) {
      throw new EmptyGenreNameException();
    }

    return new Genre(id, name);
  }

  public static fromPersistent(id: string, name: string): Genre {
    return new Genre(id, name);
  }

  public rename(name: string): void {
    if (this.name !== name) {
      this.name = name;
    }
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }
}
