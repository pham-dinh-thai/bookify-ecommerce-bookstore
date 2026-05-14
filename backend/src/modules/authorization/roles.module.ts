import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleTypeOrm } from './infrastructure/entities/role.entity';
import { ROLES_QUERY_REPOSITORY } from './domain/role-aggregate/repositories/roles-query.repository.interface';
import { TypeOrmRolesQueryRepository } from './infrastructure/repositories/roles/typeorm-roles-query.repository';
import { FindRolesUseCase } from './application/role-use-cases/find-roles/find-roles.use-case';
import { FindOneRoleUseCase } from './application/role-use-cases/find-one-role/find-one-role.use-case';
import { ROLES_COMMAND_REPOSITORY } from './domain/role-aggregate/repositories/roles-command.repository.interface';
import { TypeOrmRolesCommandRepository } from './infrastructure/repositories/roles/typeorm-roles-command.repository';
import { CreateRoleUseCase } from './application/role-use-cases/create-role/create-role.use-case';
import { ROLE_EXISTS_CHECKER } from './domain/role-aggregate/services/role-exists-checker.service.interface';
import { RoleExistsChecker } from './infrastructure/services/roles/role-exists-checker.service';
import { RenameRoleUseCase } from './application/role-use-cases/rename-role/rename-role.use-case';
import { RolesController } from './presentation/roles/roles.controller';
import { GrantPermissionUseCase } from './application/role-use-cases/grant-permission/grant-permission.use-case';
import { RolePermissionTypeOrm } from './infrastructure/entities/role-permission.entity';
import { RevokePermissionUseCase } from './application/role-use-cases/revoke-permission/revoke-permission.use-case';
import { DeleteRoleUseCase } from './application/role-use-cases/delete-role/delete-role.use-case';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { RolePermissionModule } from './role-permission.module';
import { PermissionsModule } from './permissions.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleTypeOrm, RolePermissionTypeOrm]),
    AuditLogModule,
    PermissionsModule,
    UnitOfWorkModule,
    RolePermissionModule,
    AuthenticationModule,
  ],
  controllers: [RolesController],
  providers: [
    FindRolesUseCase,
    FindOneRoleUseCase,
    CreateRoleUseCase,
    RenameRoleUseCase,
    GrantPermissionUseCase,
    RevokePermissionUseCase,
    DeleteRoleUseCase,
    {
      provide: ROLES_QUERY_REPOSITORY,
      useClass: TypeOrmRolesQueryRepository,
    },
    {
      provide: ROLES_COMMAND_REPOSITORY,
      useClass: TypeOrmRolesCommandRepository,
    },
    {
      provide: ROLE_EXISTS_CHECKER,
      useClass: RoleExistsChecker,
    },
  ],
  exports: [
    ROLES_QUERY_REPOSITORY,
    ROLES_COMMAND_REPOSITORY,
    ROLE_EXISTS_CHECKER,
  ],
})
export class RolesModule {}
