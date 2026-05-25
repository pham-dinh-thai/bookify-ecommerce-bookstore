import { Module } from '@nestjs/common';
import { MyAccountController } from './presentation/my-account/my-account.controller';
import { UserManagementModule } from '../user-management/user-management.module';
import { CustomerManagementModule } from '../customer-management/customer-management.module';
import { FindMyBasicInfoUseCase } from './application/my-account-use-cases/find-my-basic-info/find-my-basic-info.use-case';
import { AuthenticationModule } from '../authentication/authentication.module';
import { FindMyContactInfoUseCase } from './application/my-account-use-cases/find-my-contact-info/find-my-contact-info.use-case';
import { ChangeEmailUseCase } from './application/my-account-use-cases/change-email/change-email.use-case';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';

@Module({
  controllers: [MyAccountController],
  imports: [
    UserManagementModule,
    CustomerManagementModule,
    AuthenticationModule,
    AuditLogModule,
    UnitOfWorkModule,
  ],
  providers: [
    FindMyBasicInfoUseCase,
    FindMyContactInfoUseCase,
    ChangeEmailUseCase,
  ],
})
export class MyAccountModule {}
