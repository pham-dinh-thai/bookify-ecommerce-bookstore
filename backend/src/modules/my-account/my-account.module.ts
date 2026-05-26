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
import { SharedCacheModule } from '../../shared/modules/cache/cache.module';
import { UpdateBasicInfoUseCase } from './application/my-account-use-cases/update-basic-info/update-basic-info.use-case';
import { UpdatePhoneNumberUseCase } from './application/my-account-use-cases/update-phone-number/update-phone-number.use-case';
import { UuidModule } from '../../shared/modules/uuid/uuid.module';
import { ChangePasswordUseCase } from './application/my-account-use-cases/change-password/change-password.use-case';
import { AddAddressUseCase } from './application/my-account-use-cases/add-address/add-address.use-case';
import { RemoveAddressUseCase } from './application/my-account-use-cases/remove-address/remove-address.use-case';
import { SetDefaultAddressUseCase } from './application/my-account-use-cases/set-default-address/set-default-address.use-case';

@Module({
  controllers: [MyAccountController],
  imports: [
    UserManagementModule,
    CustomerManagementModule,
    AuthenticationModule,
    AuditLogModule,
    UnitOfWorkModule,
    SharedCacheModule,
    UuidModule,
  ],
  providers: [
    FindMyBasicInfoUseCase,
    FindMyContactInfoUseCase,
    ChangeEmailUseCase,
    UpdateBasicInfoUseCase,
    UpdatePhoneNumberUseCase,
    ChangePasswordUseCase,
    AddAddressUseCase,
    RemoveAddressUseCase,
    SetDefaultAddressUseCase,
  ],
})
export class MyAccountModule {}
