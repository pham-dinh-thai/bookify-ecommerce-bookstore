import { AddressProps } from './address.props';
import { AddressId } from './value-objects/address-id.value-object';
import { Street } from './value-objects/street.value-object';

export class Address {
  private constructor(
    private readonly id: AddressId,
    private street: Street,
    private provinceCode: string,
    private provinceName: string,
    private wardCode: string,
    private wardName: string,
    private isDefault: boolean,
  ) {}

  public static create(props: AddressProps): Address {
    return new Address(
      AddressId.create(props.id),
      new Street(props.street),
      props.provinceCode,
      props.provinceName,
      props.wardCode,
      props.wardName,
      props.isDefault,
    );
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getStreet(): string {
    return this.street.getValue();
  }

  public getProvinceCode(): string {
    return this.provinceCode;
  }

  public getProvinceName(): string {
    return this.provinceName;
  }

  public getWardCode(): string {
    return this.wardCode;
  }

  public getWardName(): string {
    return this.wardName;
  }

  public getIsDefault(): boolean {
    return this.isDefault;
  }
}
