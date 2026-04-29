import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { Address } from './entities/address.entity';
import { CustomerId } from './value-objects/customer-id.value-object';
import { PhoneNumber } from './value-objects/phone-number.value-object';

export class Customer extends AggregateRoot {
  private constructor(
    private readonly id: CustomerId,
    private userId: string,
    private phoneNumber: PhoneNumber,
    private addresses: Address[],
  ) {
    super();
  }

  public static create(
    id: string,
    userId: string,
    phoneNumber: string,
  ): Customer {
    const customer = new Customer(
      CustomerId.create(id),
      userId,
      PhoneNumber.create(phoneNumber),
      [],
    );

    return customer;
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getUserId(): string {
    return this.userId;
  }

  public getPhoneNumber(): string {
    return this.phoneNumber.getValue();
  }

  public getAddresses(): Address[] {
    return this.addresses;
  }
}
