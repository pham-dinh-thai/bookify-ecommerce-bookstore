import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { AuthorIdEmptyException } from './exceptions/author-id-empty.exception';
import { AuthorNameEmptyException } from './exceptions/author-name-empty.exception';

export class Author extends AggregateRoot {
  private constructor(
    private readonly id: string,
    private name: string,
  ) {
    super();
  }

  public static create(id: string, name: string): Author {
    if (!id) {
      throw new AuthorIdEmptyException();
    }

    if (!name) {
      throw new AuthorNameEmptyException();
    }

    return new Author(id, name);
  }

  public static fromPersistent(id: string, name: string): Author {
    return new Author(id, name);
  }

  public rename(name: string): { oldName: string; newName: string } {
    const oldName = this.name;

    if (name && oldName !== name) {
      this.name = name;
    }

    return { oldName, newName: this.name };
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }
}
