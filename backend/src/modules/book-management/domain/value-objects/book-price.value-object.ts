import { BookPriceEmptyException } from '../exceptions/book-price-empty.exception';
import { BookPriceLessOrEqualZeroException } from '../exceptions/book-price-less-or-equal-zero.exception';

export class BookPrice {
  private constructor(private readonly value: number) {
    if (value === null || value === undefined) {
      throw new BookPriceEmptyException();
    }

    if (value <= 0) {
      throw new BookPriceLessOrEqualZeroException();
    }
  }

  public static create(originalPrice: number): BookPrice {
    return new BookPrice(originalPrice);
  }

  public updatePrice(newPrice: number): BookPrice {
    return new BookPrice(newPrice);
  }

  public getValue(): number {
    return this.value;
  }
}
