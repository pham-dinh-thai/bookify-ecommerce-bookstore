import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class CustomerNotFoundException extends DomainException {
  public constructor(value: any) {
    if (value instanceof Object) {
      value = JSON.stringify(value);
    }

    super(`Customer with ${value} not found`, 'CUSTOMER_NOT_FOUND', 404);
  }
}
