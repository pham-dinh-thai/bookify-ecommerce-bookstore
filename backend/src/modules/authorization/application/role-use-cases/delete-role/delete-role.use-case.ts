import { Inject, Injectable } from '@nestjs/common';
import {
  type IRolesCommandRepository,
  ROLES_COMMAND_REPOSITORY,
} from '../../../domain/role-aggregate/repositories/roles-command.repository.interface';
import {
  type IRolePermissionCommandRepository,
  ROLE_PERMISSION_COMMAND_REPOSITORY,
} from '../../../domain/role-aggregate/repositories/role-permission-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';

@Injectable()
export class DeleteRoleUseCase {
  public constructor(
    @Inject(ROLES_COMMAND_REPOSITORY)
    private readonly repository: IRolesCommandRepository,

    @Inject(ROLE_PERMISSION_COMMAND_REPOSITORY)
    private readonly rolePermissionRepository: IRolePermissionCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogRepository: IAuditLogCommandRepository,
  ) {}

  public async execute(id: string, performedBy: string): Promise<void> {
    await this.unitOfWork.execute(async () => {
      const role = await this.repository.findOne(id);

      const permissions =
        await this.rolePermissionRepository.revokePermissionByRoleId(id);

      role.delete();

      await this.repository.delete(role);

      await this.auditLogRepository.write(
        'DELETE_ROLE',
        performedBy,
        'authorization',
        'roles',
        { id: id, permissionsRevoked: permissions },
      );

      role.clearDomainEvents();
    });
  }
}
