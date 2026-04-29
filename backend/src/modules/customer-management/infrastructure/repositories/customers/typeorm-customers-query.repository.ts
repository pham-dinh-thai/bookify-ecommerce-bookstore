import { Inject, Injectable, Scope } from '@nestjs/common';
import { ICustomersQueryRepository } from '../../../domain/customer-aggregate/repositories/customers-query.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerTypeOrm } from '../../entities/customer.entity';
import { Repository } from 'typeorm';
import { UserTypeOrm } from '../../../../user-management/infrastructure/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmCustomersQueryRepository implements ICustomersQueryRepository {
  public constructor(
    @InjectRepository(CustomerTypeOrm)
    private readonly repository: Repository<CustomerTypeOrm>,

    @InjectRepository(UserTypeOrm)
    private readonly userRepository: Repository<UserTypeOrm>,
  ) {}

  public async findIdByEmail(email: string): Promise<string | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user?.id || null;
  }
}
