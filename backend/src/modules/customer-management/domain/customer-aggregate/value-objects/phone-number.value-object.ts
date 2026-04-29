import { PhoneNumberInvalidException } from '../exceptions/phone-number-invalid.exception';

export class PhoneNumber {
  private static readonly REGEX = /^(\+84|0)[3-9]\d{8}$/;

  private constructor(private readonly value: string) {
    if (!PhoneNumber.REGEX.test(value)) {
      throw new PhoneNumberInvalidException();
    }
  }

  public static create(value: string): PhoneNumber {
    return new PhoneNumber(value);
  }

  getValue() {
    return this.value;
  }
}
