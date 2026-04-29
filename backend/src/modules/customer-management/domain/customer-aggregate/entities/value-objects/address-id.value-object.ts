import { AddressIdEmptyException } from '../exceptions/address-id-empty.exception';

export class AddressId {
  private constructor(private readonly value: string) {
    if (!this.value) {
      throw new AddressIdEmptyException();
    }
  }

  public static create(value: string): AddressId {
    return new AddressId(value);
  }

  public getValue(): string {
    return this.value;
  }
}
