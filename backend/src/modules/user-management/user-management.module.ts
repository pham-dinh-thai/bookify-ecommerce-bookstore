import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrm } from './infrastructure/entities/user.entity';
import { SharedCacheModule } from '../../shared/cache/cache.module';
import { UsersController } from './presentation/users/users.controller';
import { USERS_QUERY_REPOSITORY } from './domain/user-aggregate/repositories/users-query.repository.interface';
import { TypeOrmUsersQueryRepository } from './infrastructure/repositories/users/typeorm-users-query.repository';
import { FindUsersUseCase } from './application/user-use-cases/find-users/find-users.use-case';
import { FindOneUserUseCase } from './application/user-use-cases/find-one-users/find-one-user.use-case';
import { UnitOfWorkModule } from '../../shared/unit-of-work/unit-of-work.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { UuidModule } from '../../shared/uuid/uuid.module';
import { CreateUserUseCase } from './application/user-use-cases/create-user/create-user.use-case';
import { USERS_COMMAND_REPOSITORY } from './domain/user-aggregate/repositories/users-command.repository.interface';
import { TypeOrmUsersCommandRepository } from './infrastructure/repositories/users/typeorm-users-command.repository';
import { RolesModule } from '../authorization/roles.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { EMAIL_EXISTS_CHECKER } from './domain/user-aggregate/services/email-exists-checker.service';
import { EmailExistsChecker } from './infrastructure/services/email-exists-checker.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTypeOrm]),
    SharedCacheModule,
    UnitOfWorkModule,
    UuidModule,
    RolesModule,
    AuditLogModule,
    AuthenticationModule,
  ],
  providers: [
    FindUsersUseCase,
    FindOneUserUseCase,
    CreateUserUseCase,
    {
      provide: USERS_QUERY_REPOSITORY,
      useClass: TypeOrmUsersQueryRepository,
    },
    {
      provide: USERS_COMMAND_REPOSITORY,
      useClass: TypeOrmUsersCommandRepository,
    },
    {
      provide: EMAIL_EXISTS_CHECKER,
      useClass: EmailExistsChecker,
    },
  ],
  exports: [
    USERS_QUERY_REPOSITORY,
    USERS_COMMAND_REPOSITORY,
    EMAIL_EXISTS_CHECKER,
  ],
  controllers: [UsersController],
})
export class UserManagementModule {}
