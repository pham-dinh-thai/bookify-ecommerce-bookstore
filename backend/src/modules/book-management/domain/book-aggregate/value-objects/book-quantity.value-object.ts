import { BookQuantityEmptyException } from '../exceptions/book-quantity-empty.exception';
import { BookQuantityInsufficientException } from '../exceptions/book-quantity-insufficient.exception';
import { BookQuantityNegativeException } from '../exceptions/book-quantity-negative.exception';

export class BookQuantity {
  private constructor(private readonly value: number) {
    if (value === null || value === undefined) {
      throw new BookQuantityEmptyException();
    }

    if (value < 0) {
      throw new BookQuantityNegativeException();
    }
  }

  public static create(quantity: number): BookQuantity {
    return new BookQuantity(quantity);
  }

  public increase(amount: number): BookQuantity {
    return new BookQuantity(this.value + amount);
  }

  public decrease(amount: number): BookQuantity {
    if (amount > this.value) {
      throw new BookQuantityInsufficientException();
    }
    return new BookQuantity(this.value - amount);
  }

  public isInStock(): boolean {
    return this.value > 0;
  }

  public getValue(): number {
    return this.value;
  }
}
