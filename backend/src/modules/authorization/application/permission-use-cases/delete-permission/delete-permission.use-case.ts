import { Inject, Injectable } from '@nestjs/common';
import {
  type IPermissionsCommandRepository,
  PERMISSIONS_COMMAND_REPOSITORY,
} from '../../../domain/permission-aggregate/repositories/permission-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  type IRolePermissionCommandRepository,
  ROLE_PERMISSION_COMMAND_REPOSITORY,
} from '../../../domain/role-aggregate/repositories/role-permission-command.repository.interface';

@Injectable()
export class DeletePermissionUseCase {
  public constructor(
    @Inject(PERMISSIONS_COMMAND_REPOSITORY)
    private readonly repository: IPermissionsCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogRepository: IAuditLogCommandRepository,

    @Inject(ROLE_PERMISSION_COMMAND_REPOSITORY)
    private readonly rolePermissionRepository: IRolePermissionCommandRepository,
  ) {}

  public async execute(id: string, performedBy: string): Promise<void> {
    await this.unitOfWork.execute(async () => {
      const permission = await this.repository.findOne(id);

      permission.delete();

      const rolesAffected =
        await this.rolePermissionRepository.revokePermissionByPermissionId(
          permission.getId(),
        );

      await this.repository.delete(permission);

      await this.auditLogRepository.write(
        'DELETE_PERMISSION',
        performedBy,
        'authorization',
        'permissions',
        { id: permission.getId(), rolesAffected: rolesAffected },
      );

      permission.clearDomainEvents();
    });
  }
}
