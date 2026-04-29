import { AddressId } from './value-objects/address-id.value-object';
import { Street } from './value-objects/street.value-object';

export class Address {
  private constructor(
    private readonly id: AddressId,
    private street: Street,
    private provinceCode: string,
    private provinceName: string,
    private districtCode: string,
    private districtName: string,
    private wardCode: string,
    private wardName: string,
    private isDefault: boolean,
  ) {}

  public static create(
    id: string,
    street: string,
    provinceCode: string,
    provinceName: string,
    districtCode: string,
    districtName: string,
    wardCode: string,
    wardName: string,
    isDefault: boolean,
  ): Address {
    return new Address(
      AddressId.create(id),
      new Street(street),
      provinceCode,
      provinceName,
      districtCode,
      districtName,
      wardCode,
      wardName,
      isDefault,
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

  public getDistrictCode(): string {
    return this.districtCode;
  }

  public getDistrictName(): string {
    return this.districtName;
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
