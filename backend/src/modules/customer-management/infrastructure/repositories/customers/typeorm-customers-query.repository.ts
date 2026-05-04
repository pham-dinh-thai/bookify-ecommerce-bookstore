import { Injectable, Scope } from '@nestjs/common';
import { ICustomersQueryRepository } from '../../../domain/customer-aggregate/repositories/customers-query.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerTypeOrm } from '../../entities/customer.entity';
import { Repository } from 'typeorm';
import { UserTypeOrm } from '../../../../user-management/infrastructure/entities/user.entity';
import { CustomerReadModel } from '../../../domain/customer-aggregate/read-models/customer.read-model';
import { CustomersMapper } from '../../mappers/customers.mapper';

@Injectable()
export class TypeOrmCustomersQueryRepository implements ICustomersQueryRepository {
  public constructor(
    @InjectRepository(CustomerTypeOrm)
    private readonly repository: Repository<CustomerTypeOrm>,

    @InjectRepository(UserTypeOrm)
    private readonly userRepository: Repository<UserTypeOrm>,
  ) {}

  public async findAll(): Promise<CustomerReadModel[]> {
    const customers = await this.repository.find({
      relations: {
        user: true,
        addresses: true,
      },
    });

    return customers
      ? customers.map((customer) => CustomersMapper.toReadModel(customer))
      : [];
  }

  public async findIdByEmail(email: string): Promise<string | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user?.id || null;
  }
}
