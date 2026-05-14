import { Module } from '@nestjs/common';
import { ROLE_PERMISSION_COMMAND_REPOSITORY } from './domain/role-aggregate/repositories/role-permission-command.repository.interface';
import { TypeOrmRolePermissionCommandRepository } from './infrastructure/repositories/role-permission/typeorm-role-permission-command.repository';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';

@Module({
  imports: [UnitOfWorkModule],
  providers: [
    {
      provide: ROLE_PERMISSION_COMMAND_REPOSITORY,
      useClass: TypeOrmRolePermissionCommandRepository,
    },
  ],
  exports: [ROLE_PERMISSION_COMMAND_REPOSITORY],
})
export class RolePermissionModule {}
