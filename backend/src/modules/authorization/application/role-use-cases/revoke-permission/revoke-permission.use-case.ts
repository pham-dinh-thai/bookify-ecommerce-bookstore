import { Inject, Injectable } from '@nestjs/common';
import {
  type IRolesCommandRepository,
  ROLES_COMMAND_REPOSITORY,
} from '../../../domain/role-aggregate/repositories/roles-command.repository.interface';
import {
  type IPermissionExistsChecker,
  PERMISSION_EXISTS_CHECKER,
} from '../../../domain/permission-aggregate/services/permission-exists-checker.service.interface';
import { PermissionNotFoundException } from '../../../domain/permission-aggregate/exceptions/permission-not-found.exception';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import { PermissionRevoked } from '../../../domain/role-aggregate/events/permission-revoked.event';
import {
  type IRolePermissionCommandRepository,
  ROLE_PERMISSION_COMMAND_REPOSITORY,
} from '../../../domain/role-aggregate/repositories/role-permission-command.repository.interface';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';

@Injectable()
export class RevokePermissionUseCase {
  public constructor(
    @Inject(ROLES_COMMAND_REPOSITORY)
    private readonly repository: IRolesCommandRepository,

    @Inject(PERMISSION_EXISTS_CHECKER)
    private readonly permissionExistsChecker: IPermissionExistsChecker,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(ROLE_PERMISSION_COMMAND_REPOSITORY)
    private readonly rolePermissionRepository: IRolePermissionCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogRepository: IAuditLogCommandRepository,
  ) {}

  public async execute(
    id: string,
    permissionId: string,
    performedBy: string,
  ): Promise<void> {
    const permissionExistsChecker =
      await this.permissionExistsChecker.isExist(permissionId);
    if (!permissionExistsChecker) {
      throw new PermissionNotFoundException(permissionId);
    }

    await this.unitOfWork.execute(async () => {
      const role = await this.repository.findOne(id);

      role.revokePermission(permissionId);

      const event = role
        .getDomainEvents()
        .find((event) => event instanceof PermissionRevoked);

      if (event) {
        await this.rolePermissionRepository.revokePermission(
          event.roleId,
          event.permissionId,
        );

        await this.auditLogRepository.write(
          'REVOKE_PERMISSION',
          performedBy,
          'authorization',
          'roles',
          { id: event.roleId, permissionId: event.permissionId },
        );
      }

      role.clearDomainEvents();
    });
  }
}
