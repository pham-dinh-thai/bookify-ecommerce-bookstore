import { CustomerIdEmptyException } from '../exceptions/customer-id-empty.exception';

export class CustomerId {
  private constructor(private readonly value: string) {
    if (!this.value) {
      throw new CustomerIdEmptyException();
    }
  }

  public static create(value: string): CustomerId {
    return new CustomerId(value);
  }

  public getValue(): string {
    return this.value;
  }
}
