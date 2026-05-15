import { EmptyGenreIdException } from './exceptions/empty-genre-id.exception';
import { EmptyGenreNameException } from './exceptions/empty-genre-name.exception';

/**
 * Genre aggregate root.
 *
 * Rules:
 * - Name cannot be empty
 * - Id cannot be empty
 */
export class Genre {
  public constructor(
    private readonly id: string,
    private name: string,
  ) {}

  /**
   * Creates a new Genre instance with the provided id and name, enforcing validation rules.
   */
  public static create(id: string, name: string): Genre {
    if (!id) {
      throw new EmptyGenreIdException();
    }

    if (!name) {
      throw new EmptyGenreNameException();
    }

    return new Genre(id, name);
  }

  /**
   * Reconstructs a Genre from persistent data.
   */
  public static fromPersistent(id: string, name: string): Genre {
    return new Genre(id, name);
  }

  /**
   * Renames the genre, ensuring the new name is not empty and different from the current name.
   */
  public rename(name: string): { oldName: string; newName: string } {
    const oldName = this.name;
    if (oldName !== name) {
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
