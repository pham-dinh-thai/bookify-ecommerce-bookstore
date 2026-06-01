import { Module } from '@nestjs/common';
import { CustomersController } from './presentation/customers/customers.controller';
import { CUSTOMERS_QUERY_REPOSITORY } from './domain/customer-aggregate/repositories/customers-query.repository.interface';
import { TypeOrmCustomersQueryRepository } from './infrastructure/repositories/customers/typeorm-customers-query.repository';
import { CompleteInformationUseCase } from './application/customer-use-cases/complete-information/complete-information.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTypeOrm } from './infrastructure/entities/customer.entity';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { UserTypeOrm } from '../user-management/infrastructure/entities/user.entity';
import { UuidModule } from '../../shared/modules/uuid/uuid.module';
import { SharedCacheModule } from '../../shared/modules/cache/cache.module';
import { CUSTOMERS_COMMAND_REPOSITORY } from './domain/customer-aggregate/repositories/customers-command.repository.interface';
import { TypeOrmCustomersCommandRepository } from './infrastructure/repositories/customers/typeorm-customers-command.repository';
import { AddressTypeOrm } from './infrastructure/entities/address.entity';
import { PHONE_NUMBER_EXISTS_CHECKER } from './domain/customer-aggregate/services/phone-number-exists-checker.service';
import { PhoneNumberExistsCheckerService } from './infrastructure/services/phone-number-exists-checker.service';
import { SharedJwtModule } from '../../shared/modules/jwt/shared-jwt.module';
import { FindCustomersUseCase } from './application/customer-use-cases/find-customers/find-customers.use-case';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UserManagementModule } from '../user-management/user-management.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerTypeOrm, UserTypeOrm, AddressTypeOrm]),
    UnitOfWorkModule,
    AuditLogModule,
    UuidModule,
    SharedCacheModule,
    SharedJwtModule,
    AuthenticationModule,
    UserManagementModule,
  ],
  controllers: [CustomersController],
  providers: [
    CompleteInformationUseCase,
    FindCustomersUseCase,
    {
      provide: CUSTOMERS_QUERY_REPOSITORY,
      useClass: TypeOrmCustomersQueryRepository,
    },
    {
      provide: CUSTOMERS_COMMAND_REPOSITORY,
      useClass: TypeOrmCustomersCommandRepository,
    },

    {
      provide: PHONE_NUMBER_EXISTS_CHECKER,
      useClass: PhoneNumberExistsCheckerService,
    },
  ],
  exports: [
    CUSTOMERS_QUERY_REPOSITORY,
    CUSTOMERS_COMMAND_REPOSITORY,
    PHONE_NUMBER_EXISTS_CHECKER,
  ],
})
export class CustomerManagementModule {}
