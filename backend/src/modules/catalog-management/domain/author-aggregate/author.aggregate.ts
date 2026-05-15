import { AuthorIdEmptyException } from './exceptions/author-id-empty.exception';
import { AuthorNameEmptyException } from './exceptions/author-name-empty.exception';

/**
 * Author aggregate root.
 *
 * Rules:
 * - Name cannot be empty
 * - Id cannot be empty
 */
export class Author {
  private constructor(
    private readonly id: string,
    private name: string,
  ) {}

  /**
   * Creates a new Author instance with the provided id and name, enforcing validation rules.
   */
  public static create(id: string, name: string): Author {
    if (!id) {
      throw new AuthorIdEmptyException();
    }

    if (!name) {
      throw new AuthorNameEmptyException();
    }

    return new Author(id, name);
  }

  /**
   * Reconstructs an Author from persistent data.
   */
  public static fromPersistent(id: string, name: string): Author {
    return new Author(id, name);
  }

  /**
   * Rename an author, ensuring the new name is not empty and different from the current name.
   */
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
