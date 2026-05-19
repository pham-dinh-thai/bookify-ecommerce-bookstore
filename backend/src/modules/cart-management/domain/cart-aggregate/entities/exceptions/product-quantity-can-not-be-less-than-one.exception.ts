import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class ProductQuantityCanNotBeLessThanOneException extends BadRequestDomainException {
  public constructor() {
    super(
      'Product quantity can not be less than one',
      'PRODUCT_QUANTITY_LESS_THAN_ONE',
    );
  }
}
