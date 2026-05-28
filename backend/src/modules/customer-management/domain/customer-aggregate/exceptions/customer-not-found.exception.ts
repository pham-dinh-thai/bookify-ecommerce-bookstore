import { NotFoundDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class CustomerNotFoundException extends NotFoundDomainException {
  public constructor() {
    super(`Customer is not found`, 'CUSTOMER_NOT_FOUND');
  }
}
