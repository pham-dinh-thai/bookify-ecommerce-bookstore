import { Injectable, Scope } from '@nestjs/common';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { ICustomersCommandRepository } from '../../../domain/customer-aggregate/repositories/customers-command.repository.interface';
import { CustomerTypeOrm } from '../../entities/customer.entity';
import { Customer } from '../../../domain/customer-aggregate/customer.aggregate';
import { CustomersMapper } from '../../mappers/customers.mapper';
import { Address } from '../../../domain/customer-aggregate/entities/address.entity';
import { AddressTypeOrm } from '../../entities/address.entity';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmCustomersCommandRepository implements ICustomersCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findByUserId(userId: string): Promise<Customer | null> {
    const customerTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(CustomerTypeOrm, {
        where: { userId },
        relations: { user: true, addresses: true },
      });

    if (!customerTypeOrm) {
      return null;
    }

    return CustomersMapper.toDomain(customerTypeOrm);
  }

  public async insert(customer: Customer): Promise<void> {
    const customerTypeOrm = new CustomerTypeOrm();

    customerTypeOrm.id = customer.getId();
    customerTypeOrm.userId = customer.getUserId();
    customerTypeOrm.phoneNumber = customer.getPhoneNumber();

    await this.unitOfWork.getManager().insert(CustomerTypeOrm, customerTypeOrm);
  }

  public async addAddress(customerId: string, address: Address): Promise<void> {
    const addressTypeOrm = new AddressTypeOrm();

    addressTypeOrm.id = address.getId();
    addressTypeOrm.customerId = customerId;
    addressTypeOrm.street = address.getStreet();
    addressTypeOrm.provinceCode = address.getProvinceCode();
    addressTypeOrm.provinceName = address.getProvinceName();
    addressTypeOrm.wardCode = address.getWardCode();
    addressTypeOrm.wardName = address.getWardName();
    addressTypeOrm.isDefault = address.getIsDefault();

    await this.unitOfWork.getManager().insert(AddressTypeOrm, addressTypeOrm);
  }

  public async removeAddress(
    customerId: string,
    addressId: string,
  ): Promise<void> {
    await this.unitOfWork
      .getManager()
      .delete(AddressTypeOrm, { id: addressId, customerId });
  }

  public async setDefaultAddress(
    customerId: string,
    addressId: string,
  ): Promise<void> {
    await this.unitOfWork
      .getManager()
      .update(AddressTypeOrm, { customerId }, { isDefault: false });

    await this.unitOfWork
      .getManager()
      .update(
        AddressTypeOrm,
        { customerId, id: addressId },
        { isDefault: true },
      );
  }

  public async save(customer: Customer): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(CustomerTypeOrm, CustomersMapper.toTypeOrm(customer));
  }
}
