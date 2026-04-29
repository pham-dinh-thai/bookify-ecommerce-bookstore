import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class CustomerIdEmptyException extends DomainException {
  public constructor() {
    super('CustomerId should not be empty', 'CUSTOMER_ID_EMPTY', 400);
  }
}
