import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class ProductIdEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Product id is required', 'PRODUCT_ID_EMPTY');
  }
}
