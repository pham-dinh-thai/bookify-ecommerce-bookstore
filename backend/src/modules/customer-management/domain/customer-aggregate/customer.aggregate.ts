import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { Address } from './entities/address.entity';
import { AddressProps } from './entities/address.props';
import { Gender } from './enums/gender.enum';
import { CustomerId } from './value-objects/customer-id.value-object';
import { PhoneNumber } from './value-objects/phone-number.value-object';

export class Customer extends AggregateRoot {
  private constructor(
    private readonly id: CustomerId,
    private userId: string,
    private gender: Gender,
    private phoneNumber: PhoneNumber,
    private addresses: Address[],
  ) {
    super();
  }

  public static create(
    id: string,
    userId: string,
    gender: Gender,
    phoneNumber: string,
  ): Customer {
    const customer = new Customer(
      CustomerId.create(id),
      userId,
      gender,
      PhoneNumber.create(phoneNumber),
      [],
    );

    return customer;
  }

  public addAddress(props: AddressProps): Address {
    const address = Address.create(props);

    this.addresses.push(address);

    return address;
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getUserId(): string {
    return this.userId;
  }

  public getGender(): string {
    return this.gender;
  }

  public getPhoneNumber(): string {
    return this.phoneNumber.getValue();
  }

  public getAddresses(): Address[] {
    return this.addresses;
  }
}
