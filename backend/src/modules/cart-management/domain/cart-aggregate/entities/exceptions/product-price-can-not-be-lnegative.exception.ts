import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class ProductPriceCanNotNegativeException extends BadRequestDomainException {
  public constructor() {
    super(
      'Product price can not be less than 0',
      'PRODUCT_PRICE_LESS_THAN_ZERO',
    );
  }
}
