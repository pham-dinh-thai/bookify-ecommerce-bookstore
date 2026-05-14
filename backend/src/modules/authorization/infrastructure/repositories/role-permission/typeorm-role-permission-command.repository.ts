import { IRolePermissionCommandRepository } from '../../../domain/role-aggregate/repositories/role-permission-command.repository.interface';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { RolePermissionTypeOrm } from '../../entities/role-permission.entity';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmRolePermissionCommandRepository implements IRolePermissionCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async grantPermission(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(RolePermissionTypeOrm, { roleId, permissionId });
  }

  public async revokePermission(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    await this.unitOfWork
      .getManager()
      .delete(RolePermissionTypeOrm, { roleId, permissionId });
  }

  public async revokePermissionByRoleId(roleId: string): Promise<string[]> {
    const rows = await this.unitOfWork
      .getManager()
      .find(RolePermissionTypeOrm, { where: { roleId } });

    await this.unitOfWork
      .getManager()
      .delete(RolePermissionTypeOrm, { roleId });

    return rows.map((r) => r.permissionId);
  }

  public async revokePermissionByPermissionId(
    permissionId: string,
  ): Promise<string[]> {
    const rows = await this.unitOfWork
      .getManager()
      .find(RolePermissionTypeOrm, { where: { permissionId } });

    await this.unitOfWork
      .getManager()
      .delete(RolePermissionTypeOrm, { permissionId });

    return rows.map((r) => r.roleId);
  }
}
