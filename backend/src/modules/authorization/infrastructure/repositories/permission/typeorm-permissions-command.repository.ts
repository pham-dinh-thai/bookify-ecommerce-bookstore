import { Injectable, Scope } from '@nestjs/common';
import { IPermissionsCommandRepository } from '../../../domain/permission-aggregate/repositories/permission-command.repository.interface';
import { Permission } from '../../../domain/permission-aggregate/permission.aggregate';
import { PermissionNotFoundException } from '../../../domain/permission-aggregate/exceptions/permission-not-found.exception';
import { PermissionsMapper } from '../../mappers/permissions.mapper';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { PermissionTypeOrm } from '../../entities/permission.entity';

@Injectable({ scope: Scope.REQUEST })
export class TypeOrmPermissionsCommandRepository implements IPermissionsCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findOne(id: string): Promise<Permission> {
    const permissionTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(PermissionTypeOrm, { where: { id } });

    if (!permissionTypeOrm) {
      throw new PermissionNotFoundException(id);
    }

    return PermissionsMapper.toDomain(permissionTypeOrm);
  }

  public async save(permission: Permission): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(PermissionTypeOrm, PermissionsMapper.toTypeOrm(permission));
  }

  public async delete(permission: Permission): Promise<void> {
    await this.unitOfWork
      .getManager()
      .delete(PermissionTypeOrm, { id: permission.getId() });
  }
}
