import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionTypeOrm } from './infrastructure/entities/role-permission.entity';
import { ROLE_PERMISSION_COMMAND_REPOSITORY } from './domain/role-aggregate/repositories/role-permission-command.repository.interface';
import { TypeOrmRolePermissionCommandRepository } from './infrastructure/repositories/role-permission/typeorm-role-permission-command.repository';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolePermissionTypeOrm]),
    UnitOfWorkModule,
  ],
  providers: [
    {
      provide: ROLE_PERMISSION_COMMAND_REPOSITORY,
      useClass: TypeOrmRolePermissionCommandRepository,
    },
  ],
  exports: [ROLE_PERMISSION_COMMAND_REPOSITORY],
})
export class RolePermissionModule {}
