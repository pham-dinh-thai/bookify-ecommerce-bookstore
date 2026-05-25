import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { Gender } from '../../../../shared/domain/enums/gender.enum';
import { Address } from './entities/address.entity';
import {
  AddAddressProps,
  CreateCustomerProps,
  FromPersistentCustomerProps,
} from './types';
import { CustomerId } from './value-objects/customer-id.value-object';
import { PhoneNumber } from './value-objects/phone-number.value-object';

export class Customer extends AggregateRoot {
  private constructor(
    private readonly id: CustomerId,
    private userId: string,
    private gender: Gender,
    private phoneNumber?: PhoneNumber | null,
    private addresses: Address[] = [],
  ) {
    super();
  }

  public static create(props: CreateCustomerProps): Customer {
    const customer = new Customer(
      CustomerId.create(props.id),
      props.userId,
      (props.gender as Gender) ?? Gender.OTHER,
      props.phoneNumber ? PhoneNumber.create(props.phoneNumber) : null,
      [],
    );

    return customer;
  }

  public static fromPersistent(props: FromPersistentCustomerProps): Customer {
    return new Customer(
      CustomerId.create(props.id),
      props.userId,
      props.gender ?? Gender.OTHER,
      props.phoneNumber ? PhoneNumber.create(props.phoneNumber) : null,
      props.addresses.map((address) =>
        Address.fromPersistent({
          id: address.id,
          street: address.street,
          provinceCode: address.provinceCode,
          provinceName: address.provinceName,
          wardCode: address.wardCode,
          wardName: address.wardName,
          isDefault: address.isDefault,
        }),
      ),
    );
  }

  public addAddress(props: AddAddressProps): Address {
    const hasDefault = this.addresses.some((address) => address.getIsDefault());

    const address = Address.create({
      id: props.id,
      street: props.street,
      provinceCode: props.provinceCode,
      provinceName: props.provinceName,
      wardCode: props.wardCode,
      wardName: props.wardName,
      isDefault: !hasDefault,
    });

    this.addresses.push(address);

    return address;
  }

  public updatePhoneNumber(phoneNumber: string): void {
    this.phoneNumber = PhoneNumber.create(phoneNumber);
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

  public getPhoneNumber(): string | null {
    return this.phoneNumber?.getValue() ?? null;
  }

  public getAddresses(): Address[] {
    return this.addresses;
  }
}
