import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class CustomerIdEmptyException extends BadRequestDomainException {
  public constructor() {
    super('CustomerId should not be empty', 'CUSTOMER_ID_EMPTY');
  }
}
