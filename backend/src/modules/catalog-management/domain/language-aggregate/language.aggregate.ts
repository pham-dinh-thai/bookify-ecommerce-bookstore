import { LanguageIdEmptyException } from './exceptions/language-id-empty.exception';
import { LanguageNameEmptyException } from './exceptions/language-name-empty.exception';

/**
 * Language aggregate root.
 *
 * Rules:
 * - Name cannot be empty
 * - Id cannot be empty
 */
export class Language {
  private constructor(
    private readonly id: string,
    private name: string,
  ) {}

  /**
   * Creates a new Language instance with the provided id and name, enforcing validation rules.
   */
  public static create(id: string, name: string): Language {
    if (!id) {
      throw new LanguageIdEmptyException();
    }

    if (!name) {
      throw new LanguageNameEmptyException();
    }

    return new Language(id, name);
  }

  /**
   * Reconstructs a Language from persistent data.
   */
  public static fromPersistent(id: string, name: string): Language {
    return new Language(id, name);
  }

  /**
   * Renames the language, ensuring the new name is not empty and different from the current name.
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
