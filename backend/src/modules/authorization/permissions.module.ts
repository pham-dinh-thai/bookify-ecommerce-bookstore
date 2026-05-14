import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionTypeOrm } from './infrastructure/entities/permission.entity';
import { SharedCacheModule } from '../../shared/modules/cache/cache.module';
import { PermissionsController } from './presentation/permissions/permissions.controller';
import { PERMISSIONS_QUERY_REPOSITORY } from './domain/permission-aggregate/repositories/permission-query.repository.interface';
import { TypeOrmPermissionsQueryRepository } from './infrastructure/repositories/permission/typeorm-permissions-query.repository';
import { FindPermissionsUseCase } from './application/permission-use-cases/find-permissions/find-permissions.use-case';
import { FindOnePermissionUseCase } from './application/permission-use-cases/find-one-permission/find-one-permission.use-case';
import { PERMISSIONS_COMMAND_REPOSITORY } from './domain/permission-aggregate/repositories/permission-command.repository.interface';
import { TypeOrmPermissionsCommandRepository } from './infrastructure/repositories/permission/typeorm-permissions-command.repository';
import { CreatePermissionUseCase } from './application/permission-use-cases/create-permission/create-permission.use-case';
import { PERMISSION_EXISTS_CHECKER } from './domain/permission-aggregate/services/permission-exists-checker.service.interface';
import { PermissionExistsChecker } from './infrastructure/services/permissions/permission-exists-checker.service';
import { DeletePermissionUseCase } from './application/permission-use-cases/delete-permission/delete-permission.use-case';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { RolePermissionTypeOrm } from './infrastructure/entities/role-permission.entity';
import { RolePermissionModule } from './role-permission.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionTypeOrm, RolePermissionTypeOrm]),
    SharedCacheModule,
    UnitOfWorkModule,
    AuditLogModule,
    RolePermissionModule,
    AuthenticationModule,
  ],
  controllers: [PermissionsController],
  providers: [
    FindPermissionsUseCase,
    FindOnePermissionUseCase,
    CreatePermissionUseCase,
    DeletePermissionUseCase,
    {
      provide: PERMISSIONS_QUERY_REPOSITORY,
      useClass: TypeOrmPermissionsQueryRepository,
    },
    {
      provide: PERMISSIONS_COMMAND_REPOSITORY,
      useClass: TypeOrmPermissionsCommandRepository,
    },
    {
      provide: PERMISSION_EXISTS_CHECKER,
      useClass: PermissionExistsChecker,
    },
  ],
  exports: [
    PERMISSIONS_QUERY_REPOSITORY,
    PERMISSIONS_COMMAND_REPOSITORY,
    PERMISSION_EXISTS_CHECKER,
  ],
})
export class PermissionsModule {}
