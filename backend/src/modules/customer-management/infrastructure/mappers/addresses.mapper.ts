import { Address } from '../../domain/customer-aggregate/entities/address.entity';
import { AddressTypeOrm } from '../entities/address.entity';

export class AddressesMapper {
  public static toTypeOrm(
    customerId: string,
    address: Address,
  ): AddressTypeOrm {
    const addressTypeOrm = new AddressTypeOrm();

    addressTypeOrm.id = address.getId();
    addressTypeOrm.street = address.getStreet();
    addressTypeOrm.provinceCode = address.getProvinceCode();
    addressTypeOrm.provinceName = address.getProvinceName();
    addressTypeOrm.wardCode = address.getWardCode();
    addressTypeOrm.wardName = address.getWardName();
    addressTypeOrm.isDefault = address.getIsDefault();
    addressTypeOrm.customerId = customerId;

    return addressTypeOrm;
  }
}
