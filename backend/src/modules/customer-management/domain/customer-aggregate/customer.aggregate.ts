import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { CustomerId } from './value-objects/customer-id.value-object';
import { PhoneNumber } from './value-objects/phone-number.value-object';

export class Customer extends AggregateRoot {
  private constructor(
    private readonly id: CustomerId,
    private userId: string,
    private phoneNumber: PhoneNumber,
  ) {
    super();
  }
}
