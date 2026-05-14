import { Inject, Injectable } from '@nestjs/common';
import {
  type IRolesCommandRepository,
  ROLES_COMMAND_REPOSITORY,
} from '../../../domain/role-aggregate/repositories/roles-command.repository.interface';
import { IRenameRoleRequest } from './rename-role.request';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import { RoleRenamed } from '../../../domain/role-aggregate/events/role-renamed.event';

@Injectable()
export class RenameRoleUseCase {
  public constructor(
    @Inject(ROLES_COMMAND_REPOSITORY)
    private readonly repository: IRolesCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogRepository: IAuditLogCommandRepository,
  ) {}

  public async execute(
    id: string,
    request: IRenameRoleRequest,
    performedBy: string,
  ): Promise<void> {
    await this.unitOfWork.execute(async () => {
      const role = await this.repository.findOne(id);

      role.rename(request.name);

      await this.repository.save(role);

      const event = role
        .getDomainEvents()
        .find((event) => event instanceof RoleRenamed);

      if (event) {
        await this.auditLogRepository.write(
          'RENAME_ROLE',
          performedBy,
          'authorization',
          'roles',
          {
            id: role.getId(),
            oldName: event.oldName,
            newName: event.newName,
          },
        );
      }

      role.clearDomainEvents();
    });
  }
}
