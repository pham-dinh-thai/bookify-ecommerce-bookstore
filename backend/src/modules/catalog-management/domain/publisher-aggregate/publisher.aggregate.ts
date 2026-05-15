import { PublisherIdEmptyException } from './exceptions/publisher-id-empty.exception';
import { PublisherNameEmptyException } from './exceptions/publisher-name.empty.exception';

/**
 * Publisher aggregate root.
 *
 * Rules:
 * - Name cannot be empty
 * - Id cannot be empty
 */
export class Publisher {
  private constructor(
    private readonly id: string,
    private name: string,
  ) {}

  /**
   * Creates a new Publisher instance with the provided id and name, enforcing validation rules.
   */
  public static create(id: string, name: string): Publisher {
    if (!id) {
      throw new PublisherIdEmptyException();
    }

    if (!name) {
      throw new PublisherNameEmptyException();
    }

    return new Publisher(id, name);
  }

  /**
   * Reconstructs a Publisher from persistent data.
   */
  public static fromPersistent(id: string, name: string): Publisher {
    return new Publisher(id, name);
  }

  /**
   * Renames the publisher, ensuring the new name is not empty and different from the current name.
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
