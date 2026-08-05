import { BookDiscountPercentageEmptyException } from '../exceptions/book-discount-percentage-empty.exception';
import { BookDiscountPercentageNegativeException } from '../exceptions/book-discount-percentage-negative.exception';
import { BookDiscountPercentageTooHighException } from '../exceptions/book-discount-percentage-too-high.exception';

export class BookDiscountPercentage {
  private constructor(private readonly value: number) {
    if (value === null || value === undefined) {
      throw new BookDiscountPercentageEmptyException();
    }

    if (value < 0) {
      throw new BookDiscountPercentageNegativeException();
    }

    if (value > 100) {
      throw new BookDiscountPercentageTooHighException();
    }
  }

  public static create(discountPercentage: number): BookDiscountPercentage {
    return new BookDiscountPercentage(discountPercentage);
  }

  public update(discountPercentage: number): BookDiscountPercentage {
    return new BookDiscountPercentage(discountPercentage);
  }

  public getValue(): number {
    return this.value;
  }
}
