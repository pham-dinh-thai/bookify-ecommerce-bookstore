import { Address } from '../../domain/customer-aggregate/entities/address.entity';
import { AddressReadModel } from '../../domain/customer-aggregate/entities/read-models/address.read-model';
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

  public static toReadModel(addressTypeOrm: AddressTypeOrm): AddressReadModel {
    return new AddressReadModel(
      addressTypeOrm.id,
      addressTypeOrm.street,
      addressTypeOrm.provinceName,
      addressTypeOrm.wardName,
      addressTypeOrm.isDefault,
    );
  }
}
