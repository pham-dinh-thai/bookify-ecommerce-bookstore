import { Injectable, Scope } from '@nestjs/common';
import { ICustomersQueryRepository } from '../../../domain/customer-aggregate/repositories/customers-query.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerTypeOrm } from '../../entities/customer.entity';
import { Repository } from 'typeorm';
import { UserTypeOrm } from '../../../../user-management/infrastructure/entities/user.entity';
import { CustomerDetailReadModel } from '../../../domain/customer-aggregate/read-models/customer-detail.read-model';
import { CustomersMapper } from '../../mappers/customers.mapper';
import { CustomerFilter } from '../../../domain/customer-aggregate/customer.filter';
import { CustomerReadModel } from '../../../domain/customer-aggregate/read-models/customer.read-model';
import { AddressReadModel } from '../../../domain/customer-aggregate/entities/read-models/address.read-model';

@Injectable()
export class TypeOrmCustomersQueryRepository implements ICustomersQueryRepository {
  public constructor(
    @InjectRepository(CustomerTypeOrm)
    private readonly repository: Repository<CustomerTypeOrm>,

    @InjectRepository(UserTypeOrm)
    private readonly userRepository: Repository<UserTypeOrm>,
  ) {}

  public async findAll(
    page: number,
    limit: number,
    filter?: CustomerFilter,
    search?: string,
  ): Promise<CustomerDetailReadModel[]> {
    const query = this.repository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.user', 'user')
      .leftJoinAndSelect('customer.addresses', 'address');

    if (filter?.isActive !== undefined) {
      query.andWhere('user.isActive = :isActive', {
        isActive: filter.isActive,
      });
    }

    if (search) {
      query.andWhere(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const customersTypeOrm = await query
      .orderBy('customer.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return customersTypeOrm.map((customerTypeOrm) =>
      CustomersMapper.toReadModel(customerTypeOrm),
    );
  }

  public async findByUserId(userId: string): Promise<CustomerReadModel | null> {
    const customerTypeOrm = await this.repository.findOne({
      where: { userId },
      relations: { addresses: true },
    });

    return customerTypeOrm
      ? new CustomerReadModel(
          customerTypeOrm.id,
          customerTypeOrm.phoneNumber,
          customerTypeOrm.addresses.map(
            (addressTypeOrm) =>
              new AddressReadModel(
                addressTypeOrm.id,
                addressTypeOrm.street,
                addressTypeOrm.provinceName,
                addressTypeOrm.wardName,
                addressTypeOrm.isDefault,
              ),
          ),
        )
      : null;
  }

  public async findIdByEmail(email: string): Promise<string | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user?.id || null;
  }

  public async count(
    filter?: CustomerFilter,
    search?: string,
  ): Promise<number> {
    const query = this.repository
      .createQueryBuilder('customer')
      .leftJoin('customer.user', 'user');

    if (filter?.isActive !== undefined) {
      query.andWhere('user.isActive = :isActive', {
        isActive: filter.isActive,
      });
    }

    if (search) {
      query.andWhere(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    return query.getCount();
  }
}
