import { InvalidNameLengthException } from '../exceptions/invalid-name-length.exception';
import { UserNameEmptyException } from '../exceptions/user-name-empty.exception';

export class Name {
  private static MIN_LENGTH = 2;
  private static MAX_LENGTH = 100;

  private constructor(private readonly value: string) {}

  public static create(value: string): Name {
    if (!value?.trim()) {
      throw new UserNameEmptyException();
    }

    const normalized = value.trim().replace(/\s+/g, ' ');

    if (
      normalized.length < Name.MIN_LENGTH ||
      normalized.length > Name.MAX_LENGTH
    ) {
      throw new InvalidNameLengthException();
    }

    return new Name(normalized);
  }

  public getValue(): string {
    return this.value;
  }
}
