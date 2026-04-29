import { StreetEmptyException } from '../exceptions/street-empty.exception';
import { StreetTooLongException } from '../exceptions/street-too-long.exception';

export class Street {
  private static readonly MAX_LENGTH = 255;

  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new StreetEmptyException();
    }
    if (value.length > Street.MAX_LENGTH) {
      throw new StreetTooLongException();
    }
  }

  public getValue(): string {
    return this.value;
  }
}
