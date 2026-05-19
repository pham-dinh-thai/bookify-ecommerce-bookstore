import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class ProductPriceEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Product quantity is required', 'PRODUCT_QUANTITY_EMPTY');
  }
}
