import { Injectable, Scope } from '@nestjs/common';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { ICustomersCommandRepository } from '../../../domain/customer-aggregate/repositories/customers-command.repository.interface';
import { CustomerTypeOrm } from '../../entities/customer.entity';
import { Customer } from '../../../domain/customer-aggregate/customer.aggregate';
import { CustomersMapper } from '../../mappers/customers.mapper';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmCustomersCommandRepository implements ICustomersCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async save(customer: Customer): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(CustomerTypeOrm, CustomersMapper.toTypeOrm(customer));
  }
}
