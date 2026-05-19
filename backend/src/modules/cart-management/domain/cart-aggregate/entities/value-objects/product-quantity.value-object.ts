import { ProductQuantityCanNotBeLessThanOneException } from '../exceptions/product-quantity-can-not-be-less-than-one.exception';

export class ProductQuantity {
  private constructor(private readonly value: number) {
    if (!this.value || this.value <= 0) {
      throw new ProductQuantityCanNotBeLessThanOneException();
    }
  }

  public static create(quantity: number): ProductQuantity {
    return new ProductQuantity(quantity);
  }

  public update(quantity: number): ProductQuantity {
    return new ProductQuantity(quantity);
  }
}
