import { Inject, Injectable } from '@nestjs/common';
import {
  type IRolesCommandRepository,
  ROLES_COMMAND_REPOSITORY,
} from '../../../domain/role-aggregate/repositories/roles-command.repository.interface';
import { IGrantPermissionRequest } from './grant-permission.request';
import {
  type IPermissionExistsChecker,
  PERMISSION_EXISTS_CHECKER,
} from '../../../domain/permission-aggregate/services/permission-exists-checker.service.interface';
import { PermissionNotFoundException } from '../../../domain/permission-aggregate/exceptions/permission-not-found.exception';
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
export class GrantPermissionUseCase {
  public constructor(
    @Inject(ROLES_COMMAND_REPOSITORY)
    private readonly repository: IRolesCommandRepository,

    @Inject(PERMISSION_EXISTS_CHECKER)
    private readonly permissionExistsChecker: IPermissionExistsChecker,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogRepository: IAuditLogCommandRepository,

    @Inject(ROLE_PERMISSION_COMMAND_REPOSITORY)
    private readonly rolePermissionRepository: IRolePermissionCommandRepository,
  ) {}

  public async execute(
    id: string,
    request: IGrantPermissionRequest,
    performedBy: string,
  ): Promise<void> {
    const isPermissionExists = await this.permissionExistsChecker.isExist(
      request.permissionId,
    );
    if (!isPermissionExists) {
      throw new PermissionNotFoundException(request.permissionId);
    }

    await this.unitOfWork.execute(async () => {
      const role = await this.repository.findOne(id);

      role.grantPermission(request.permissionId);

      await this.rolePermissionRepository.grantPermission(
        id,
        request.permissionId,
      );

      await this.auditLogRepository.write(
        'GRANT_PERMISSION',
        performedBy,
        'authorization',
        'role_permission',
        { roleId: id, permissionId: request.permissionId },
      );

      role.clearDomainEvents();
    });
  }
}
