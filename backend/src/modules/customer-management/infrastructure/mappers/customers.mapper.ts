import { Gender } from '../../../../shared/domain/enums/gender.enum';
import { Customer } from '../../domain/customer-aggregate/customer.aggregate';
import { CustomerDetailReadModel } from '../../domain/customer-aggregate/read-models/customer-detail.read-model';
import { CustomerTypeOrm } from '../entities/customer.entity';
import { AddressesMapper } from './addresses.mapper';

export class CustomersMapper {
  public static toDomain(customerTypeOrm: CustomerTypeOrm): Customer {
    return Customer.fromPersistent({
      id: customerTypeOrm.id,
      userId: customerTypeOrm.userId,
      gender: customerTypeOrm.user.gender as Gender,
      phoneNumber: customerTypeOrm?.phoneNumber ?? null,
      addresses: customerTypeOrm.addresses.map((addressTypeOrm) => ({
        id: addressTypeOrm.id,
        street: addressTypeOrm.street,
        provinceCode: addressTypeOrm.provinceCode,
        provinceName: addressTypeOrm.provinceName,
        wardCode: addressTypeOrm.wardCode,
        wardName: addressTypeOrm.wardName,
        isDefault: addressTypeOrm.isDefault,
      })),
    });
  }

  public static toTypeOrm(customer: Customer): CustomerTypeOrm {
    const customerTypeOrm = new CustomerTypeOrm();

    customerTypeOrm.id = customer.getId();
    customerTypeOrm.userId = customer.getUserId();
    customerTypeOrm.phoneNumber = customer?.getPhoneNumber() ?? null;

    return customerTypeOrm;
  }

  public static toReadModel(
    customerTypeOrm: CustomerTypeOrm,
  ): CustomerDetailReadModel {
    return new CustomerDetailReadModel(
      customerTypeOrm.id,
      customerTypeOrm.userId,
      customerTypeOrm.user.firstName,
      customerTypeOrm.user.lastName,
      customerTypeOrm.user.email,
      customerTypeOrm.user.gender as Gender,
      customerTypeOrm?.phoneNumber ?? null,
      customerTypeOrm.addresses
        ? customerTypeOrm.addresses.map((address) =>
            AddressesMapper.toReadModel(address),
          )
        : [],
      customerTypeOrm.user.isActive,
    );
  }
}
