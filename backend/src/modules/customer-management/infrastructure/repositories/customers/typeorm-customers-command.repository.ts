import { Injectable, Scope } from '@nestjs/common';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { ICustomersCommandRepository } from '../../../domain/customer-aggregate/repositories/customers-command.repository.interface';
import { CustomerTypeOrm } from '../../entities/customer.entity';
import { Customer } from '../../../domain/customer-aggregate/customer.aggregate';
import { CustomersMapper } from '../../mappers/customers.mapper';
import { CustomerNotFoundException } from '../../../domain/customer-aggregate/exceptions/customer-not-found.exception';
import { Gender } from '../../../../../shared/domain/enums/gender.enum';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmCustomersCommandRepository implements ICustomersCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findByUserId(userId: string): Promise<Customer | null> {
    const customerTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(CustomerTypeOrm, {
        where: { userId },
        relations: { user: true },
      });

    if (!customerTypeOrm) {
      return null;
    }

    return Customer.create({
      id: customerTypeOrm.id,
      userId: customerTypeOrm.userId,
      gender: customerTypeOrm.user.gender as Gender,
      phoneNumber: customerTypeOrm.phoneNumber,
    });
  }

  public async insert(customer: Customer): Promise<void> {
    const customerTypeOrm = new CustomerTypeOrm();

    customerTypeOrm.id = customer.getId();
    customerTypeOrm.userId = customer.getUserId();
    customerTypeOrm.phoneNumber = customer.getPhoneNumber();

    await this.unitOfWork.getManager().insert(CustomerTypeOrm, customerTypeOrm);
  }

  public async save(customer: Customer): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(CustomerTypeOrm, CustomersMapper.toTypeOrm(customer));
  }
}
