import { Inject, Injectable } from '@nestjs/common';
import { ICreateRoleRequest } from './create-role.request';
import {
  type IRolesCommandRepository,
  ROLES_COMMAND_REPOSITORY,
} from '../../../domain/role-aggregate/repositories/roles-command.repository.interface';
import { Role } from '../../../domain/role-aggregate/role.aggregate';
import {
  type IRoleExistsChecker,
  ROLE_EXISTS_CHECKER,
} from '../../../domain/role-aggregate/services/role-exists-checker.service.interface';
import { RoleAlreadyExistsException } from '../../../domain/role-aggregate/exceptions/role-already-exists.exception';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';

@Injectable()
export class CreateRoleUseCase {
  public constructor(
    @Inject(ROLES_COMMAND_REPOSITORY)
    private readonly repository: IRolesCommandRepository,

    @Inject(ROLE_EXISTS_CHECKER)
    private readonly roleExistChecker: IRoleExistsChecker,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogRepository: IAuditLogCommandRepository,
  ) {}

  public async execute(
    request: ICreateRoleRequest,
    performedBy: string,
  ): Promise<void> {
    const role = Role.create(request.name);

    const isExists = await this.roleExistChecker.isExist(role.getId());
    if (isExists) {
      throw new RoleAlreadyExistsException(role.getId());
    }

    await this.unitOfWork.execute(async () => {
      await this.repository.save(role);

      await this.auditLogRepository.write(
        'CREATE_ROLE',
        performedBy,
        'authorization',
        'roles',
        { id: role.getId() },
      );

      role.clearDomainEvents();
    });
  }
}
