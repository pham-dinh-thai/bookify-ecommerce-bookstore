import { Module } from '@nestjs/common';
import { CustomersController } from './presentation/customers/customers.controller';
import { CUSTOMERS_QUERY_REPOSITORY } from './domain/customer-aggregate/repositories/customers-query.repository.interface';
import { TypeOrmCustomersQueryRepository } from './infrastructure/repositories/customers/typeorm-customers-query.repository';
import { CompleteInformationUseCase } from './application/customer-use-cases/complete-information/complete-information.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTypeOrm } from './infrastructure/entities/customer.entity';
import { UnitOfWorkModule } from '../../shared/unit-of-work/unit-of-work.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { UserTypeOrm } from '../user-management/infrastructure/entities/user.entity';
import { UuidModule } from '../../shared/uuid/uuid.module';
import { SharedCacheModule } from '../../shared/cache/cache.module';
import { CUSTOMERS_COMMAND_REPOSITORY } from './domain/customer-aggregate/repositories/customers-command.repository.interface';
import { TypeOrmCustomersCommandRepository } from './infrastructure/repositories/customers/typeorm-customers-command.repository';
import { AddressTypeOrm } from './infrastructure/entities/address.entity';
import { ADDRESSES_COMMAND_REPOSITORY } from './domain/customer-aggregate/entities/repositories/addresses-command.repository.interface';
import { TypeOrmAddressesCommandRepository } from './infrastructure/repositories/addresses/typeorm-addresses-command.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerTypeOrm, UserTypeOrm, AddressTypeOrm]),
    UnitOfWorkModule,
    AuditLogModule,
    UuidModule,
    SharedCacheModule,
  ],
  controllers: [CustomersController],
  providers: [
    CompleteInformationUseCase,
    {
      provide: CUSTOMERS_QUERY_REPOSITORY,
      useClass: TypeOrmCustomersQueryRepository,
    },
    {
      provide: CUSTOMERS_COMMAND_REPOSITORY,
      useClass: TypeOrmCustomersCommandRepository,
    },
    {
      provide: ADDRESSES_COMMAND_REPOSITORY,
      useClass: TypeOrmAddressesCommandRepository,
    },
  ],
  exports: [
    CUSTOMERS_QUERY_REPOSITORY,
    CUSTOMERS_COMMAND_REPOSITORY,
    ADDRESSES_COMMAND_REPOSITORY,
  ],
})
export class CustomerManagementModule {}
